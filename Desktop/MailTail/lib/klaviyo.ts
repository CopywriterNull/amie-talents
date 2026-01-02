import { FOOTER_HTML, FEED_TAG, WEB_FEED_NAME } from "@/lib/footer-content";
import { getFeedUrl } from "@/lib/api-keys";

const KLAVIYO_BASE_URL = "https://a.klaviyo.com/api";
const KLAVIYO_REVISION = "2025-10-15";

// Re-export for backwards compatibility
export const MAILTAIL_FOOTER = FOOTER_HTML;

function getHeaders(apiKey: string) {
  return {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    revision: KLAVIYO_REVISION,
  };
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  const res = await fetch(`${KLAVIYO_BASE_URL}/templates/`, {
    headers: getHeaders(apiKey),
  });
  return res.ok;
}

export interface KlaviyoTemplate {
  id: string;
  name: string;
  editor_type: string;
  html: string;
  updated: string;
  created: string;
}

export async function listTemplates(
  apiKey: string,
  cursor?: string
): Promise<{ templates: KlaviyoTemplate[]; nextCursor: string | null }> {
  // Sort by most recently updated
  let url = `${KLAVIYO_BASE_URL}/templates/?sort=-updated`;
  if (cursor) {
    url += `&page[cursor]=${encodeURIComponent(cursor)}`;
  }

  const res = await fetch(url, {
    headers: getHeaders(apiKey),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    console.error("Klaviyo API error:", res.status, errorData);
    throw new Error(
      errorData?.errors?.[0]?.detail || `Klaviyo API error: ${res.status}`
    );
  }

  const data = await res.json();
  const templates: KlaviyoTemplate[] = data.data.map((t: { id: string; attributes: { name: string; editor_type: string; html: string; updated: string; created: string } }) => ({
    id: t.id,
    name: t.attributes.name,
    editor_type: t.attributes.editor_type,
    html: t.attributes.html,
    updated: t.attributes.updated,
    created: t.attributes.created,
  }));

  const nextCursor = data.links?.next
    ? new URL(data.links.next).searchParams.get("page[cursor]")
    : null;

  return { templates, nextCursor };
}

export async function getTemplate(
  apiKey: string,
  templateId: string
): Promise<{ html: string; name: string }> {
  const res = await fetch(`${KLAVIYO_BASE_URL}/templates/${templateId}`, {
    headers: getHeaders(apiKey),
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Template not found");
    }
    throw new Error("Failed to fetch template from Klaviyo");
  }

  const data = await res.json();
  return {
    html: data.data.attributes.html,
    name: data.data.attributes.name,
  };
}

export async function createTemplate(
  apiKey: string,
  name: string,
  html: string
): Promise<string> {
  const res = await fetch(`${KLAVIYO_BASE_URL}/templates/`, {
    method: "POST",
    headers: getHeaders(apiKey),
    body: JSON.stringify({
      data: {
        type: "template",
        attributes: {
          name,
          editor_type: "CODE",
          html,
        },
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.errors?.[0]?.detail || "Failed to create template in Klaviyo"
    );
  }

  const data = await res.json();
  return data.data.id;
}

export function injectFooter(html: string): string {
  // Inject footer before </body> tag
  const bodyCloseIndex = html.toLowerCase().lastIndexOf("</body>");
  if (bodyCloseIndex === -1) {
    // If no </body> tag, append to end
    return html + MAILTAIL_FOOTER;
  }
  return (
    html.slice(0, bodyCloseIndex) + MAILTAIL_FOOTER + html.slice(bodyCloseIndex)
  );
}

/**
 * Inject the web feed tag instead of the actual footer content
 * This hides our tech - the content is fetched dynamically when Klaviyo sends the email
 */
export function injectFeedTag(html: string): string {
  const bodyCloseIndex = html.toLowerCase().lastIndexOf("</body>");
  if (bodyCloseIndex === -1) {
    return html + FEED_TAG;
  }
  return html.slice(0, bodyCloseIndex) + FEED_TAG + "\n" + html.slice(bodyCloseIndex);
}

// ============================================
// Web Feed API Functions
// ============================================

interface KlaviyoWebFeed {
  id: string;
  name: string;
  url: string;
}

/**
 * List all web feeds in the Klaviyo account
 */
export async function listWebFeeds(apiKey: string): Promise<KlaviyoWebFeed[]> {
  const res = await fetch(`${KLAVIYO_BASE_URL}/web-feeds/`, {
    headers: getHeaders(apiKey),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.errors?.[0]?.detail || `Failed to list web feeds: ${res.status}`);
  }

  const data = await res.json();
  return (data.data || []).map((feed: { id: string; attributes: { name: string; url: string } }) => ({
    id: feed.id,
    name: feed.attributes.name,
    url: feed.attributes.url,
  }));
}

/**
 * Check if the MailTail web feed already exists
 */
export async function findMailTailFeed(apiKey: string): Promise<KlaviyoWebFeed | null> {
  const feeds = await listWebFeeds(apiKey);
  return feeds.find((f) => f.name === WEB_FEED_NAME) || null;
}

/**
 * Create the MailTail web feed in the user's Klaviyo account
 */
export async function createMailTailFeed(
  apiKey: string,
  teamApiKey: string
): Promise<string> {
  const feedUrl = getFeedUrl(teamApiKey);

  const res = await fetch(`${KLAVIYO_BASE_URL}/web-feeds/`, {
    method: "POST",
    headers: getHeaders(apiKey),
    body: JSON.stringify({
      data: {
        type: "web-feed",
        attributes: {
          name: WEB_FEED_NAME,
          url: feedUrl,
          method: "GET",
          content_type: "json",
        },
      },
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.errors?.[0]?.detail || `Failed to create web feed: ${res.status}`);
  }

  const data = await res.json();
  return data.data.id;
}

/**
 * Ensure the MailTail web feed exists in the user's Klaviyo account
 * Creates it if it doesn't exist
 * Returns the feed ID
 */
export async function ensureWebFeedExists(
  klaviyoApiKey: string,
  teamApiKey: string
): Promise<{ feedId: string; created: boolean }> {
  // Check if feed already exists
  const existingFeed = await findMailTailFeed(klaviyoApiKey);
  if (existingFeed) {
    return { feedId: existingFeed.id, created: false };
  }

  // Create new feed
  const feedId = await createMailTailFeed(klaviyoApiKey, teamApiKey);
  return { feedId, created: true };
}

/**
 * Update an existing web feed URL (e.g., if API key was regenerated)
 */
export async function updateWebFeedUrl(
  klaviyoApiKey: string,
  feedId: string,
  newTeamApiKey: string
): Promise<void> {
  const feedUrl = getFeedUrl(newTeamApiKey);

  const res = await fetch(`${KLAVIYO_BASE_URL}/web-feeds/${feedId}/`, {
    method: "PATCH",
    headers: getHeaders(klaviyoApiKey),
    body: JSON.stringify({
      data: {
        type: "web-feed",
        id: feedId,
        attributes: {
          url: feedUrl,
        },
      },
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.errors?.[0]?.detail || `Failed to update web feed: ${res.status}`);
  }
}

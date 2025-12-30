'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Shield, Mail, Key, Check, AlertTriangle, X, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface DKIMSelector {
  type: string;
  selector: string;
  record: string;
  sha256?: boolean;
  rsa?: boolean;
  notTesting?: boolean;
  secureKeyLength?: boolean;
}

interface HealthCheckResult {
  dmarcResult: {
    type: string;
    record: string;
    rejectOrQuarantine?: boolean;
    supedRua?: boolean;
    fo1?: boolean;
    spNone?: boolean;
  };
  spfResult: {
    type: string;
    record: string;
    lookupLimit?: boolean;
    sizeLimit?: boolean;
  };
  dkimResult: {
    selectors: DKIMSelector[];
  };
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function StatusIcon({ status }: { status: 'valid' | 'warning' | 'error' }) {
  if (status === 'valid') {
    return (
      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
        <Check className="w-4 h-4 text-green-600" />
      </div>
    );
  }
  if (status === 'warning') {
    return (
      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
        <AlertTriangle className="w-4 h-4 text-yellow-600" />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
      <X className="w-4 h-4 text-red-600" />
    </div>
  );
}

function calculateGrade(result: HealthCheckResult): { grade: string; color: string; percentile: number } {
  let score = 0;
  let maxScore = 0;

  // DMARC scoring (40 points max)
  maxScore += 40;
  if (result.dmarcResult.type === 'valid') {
    score += 20;
    if (result.dmarcResult.rejectOrQuarantine) score += 15;
    if (result.dmarcResult.fo1) score += 5;
  }

  // SPF scoring (30 points max)
  maxScore += 30;
  if (result.spfResult.type === 'valid') {
    score += 20;
    if (result.spfResult.lookupLimit) score += 5;
    if (result.spfResult.sizeLimit) score += 5;
  }

  // DKIM scoring (30 points max)
  maxScore += 30;
  const validDkim = result.dkimResult.selectors.filter(s => s.type === 'valid').length;
  const totalDkim = result.dkimResult.selectors.length;
  if (totalDkim > 0) {
    score += Math.round((validDkim / totalDkim) * 20);
    const hasSecureKeys = result.dkimResult.selectors.some(s => s.secureKeyLength);
    if (hasSecureKeys) score += 10;
  }

  const percentage = (score / maxScore) * 100;

  if (percentage >= 90) return { grade: 'A+', color: 'text-green-500', percentile: 5 };
  if (percentage >= 80) return { grade: 'A', color: 'text-green-500', percentile: 9 };
  if (percentage >= 70) return { grade: 'A-', color: 'text-green-500', percentile: 15 };
  if (percentage >= 60) return { grade: 'B+', color: 'text-green-600', percentile: 25 };
  if (percentage >= 50) return { grade: 'B', color: 'text-yellow-500', percentile: 35 };
  if (percentage >= 40) return { grade: 'C+', color: 'text-yellow-500', percentile: 50 };
  if (percentage >= 30) return { grade: 'C', color: 'text-orange-500', percentile: 65 };
  if (percentage >= 20) return { grade: 'D', color: 'text-orange-500', percentile: 80 };
  return { grade: 'F', color: 'text-red-500', percentile: 95 };
}

function getStatus(type: string): 'valid' | 'warning' | 'error' {
  if (type === 'valid') return 'valid';
  if (type === 'missing' || type === 'invalid') return 'error';
  return 'warning';
}

function getStatusText(type: string, hasIssues: boolean = false): string {
  if (type === 'valid' && !hasIssues) return 'No issues found';
  if (type === 'valid' && hasIssues) return 'Needs improvement';
  if (type === 'missing') return 'Not configured';
  return 'Invalid configuration';
}

function getDmarcIssues(result: HealthCheckResult['dmarcResult']): string[] {
  const issues: string[] = [];
  if (result.type !== 'valid') {
    issues.push('DMARC record is not properly configured');
  } else {
    if (!result.rejectOrQuarantine) issues.push('Policy should be set to quarantine or reject');
    if (result.spNone) issues.push('Subdomain policy is set to none');
    if (!result.fo1) issues.push('Consider adding fo=1 for better failure reporting');
  }
  return issues;
}

function getSpfIssues(result: HealthCheckResult['spfResult']): string[] {
  const issues: string[] = [];
  if (result.type !== 'valid') {
    issues.push('SPF record is not properly configured');
  } else {
    if (!result.lookupLimit) issues.push('SPF record may exceed 10 DNS lookup limit');
    if (!result.sizeLimit) issues.push('SPF record may exceed 255 character limit');
  }
  return issues;
}

function getDkimIssues(selector: DKIMSelector): string[] {
  const issues: string[] = [];
  if (selector.type !== 'valid') {
    issues.push('DKIM record is not properly configured');
  } else {
    if (!selector.secureKeyLength) issues.push('Key length should be at least 1024 bits');
    if (!selector.sha256) issues.push('Consider using SHA-256 algorithm');
    if (!selector.notTesting) issues.push('Record is in testing mode');
  }
  return issues;
}

export default function DomainHealthCheck() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const [checkedDomain, setCheckedDomain] = useState('');

  const checkDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`/api/tools/domain-health?domain=${encodeURIComponent(domain.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check domain');
      }

      if (data.result?.data?.json) {
        setResult(data.result.data.json);
        setCheckedDomain(domain.trim());
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check domain');
    } finally {
      setLoading(false);
    }
  };

  const gradeInfo = result ? calculateGrade(result) : null;
  const dmarcIssues = result ? getDmarcIssues(result.dmarcResult) : [];
  const spfIssues = result ? getSpfIssues(result.spfResult) : [];
  const hasCriticalIssues = result && (
    result.dmarcResult.type !== 'valid' ||
    result.spfResult.type !== 'valid' ||
    result.dkimResult.selectors.some(s => s.type !== 'valid')
  );

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#e5e5e5]">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between h-12 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#171717] flex items-center justify-center">
                <MailIcon className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold">MailTail</span>
            </Link>
            <Link href="/tools/dmarc-generator">
              <Button variant="ghost" size="sm" className="text-xs h-7">
                DMARC Generator
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <Badge variant="secondary" className="mb-2 text-xs">
            <Search className="w-3 h-3 mr-1" />
            Free Tool
          </Badge>
          <h1 className="text-2xl font-bold mb-1">Domain Health Check</h1>
          <p className="text-sm text-[#737373]">
            Check your domain&apos;s DMARC, SPF, and DKIM configuration.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={checkDomain} className="mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter domain (e.g. example.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="h-10"
            />
            <Button type="submit" disabled={loading || !domain.trim()} className="h-10 px-6">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
            </Button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && gradeInfo && (
          <div className="space-y-4">
            {/* Domain Header */}
            <div className="text-center py-4">
              <div className="text-sm text-[#737373]">DMARC scan for</div>
              <div className="text-2xl font-semibold text-[#171717]">{checkedDomain}</div>
            </div>

            {/* Grade and Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
                <div className="text-sm text-[#737373] mb-1">Overall grade</div>
                <div className={`text-5xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</div>
                <div className="text-xs text-[#737373] mt-2">
                  Top <span className="font-medium">{gradeInfo.percentile}%</span> of domains
                </div>
              </div>

              <div className={`rounded-lg border p-6 ${
                hasCriticalIssues
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-green-50 border-green-300'
              }`}>
                <div className={`text-base font-medium mb-2 ${
                  hasCriticalIssues ? 'text-yellow-800' : 'text-green-800'
                }`}>
                  {hasCriticalIssues ? 'Issues found' : 'No critical issues'}
                </div>
                <div className="text-xs text-[#525252]">
                  {hasCriticalIssues
                    ? 'Review the details below to improve your email security.'
                    : 'Your domain has good email authentication configured.'}
                </div>
              </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'DMARC',
                  status: getStatus(result.dmarcResult.type),
                  hasIssues: dmarcIssues.length > 0,
                  icon: <Shield className="w-4 h-4" />
                },
                {
                  label: 'SPF',
                  status: getStatus(result.spfResult.type),
                  hasIssues: spfIssues.length > 0,
                  icon: <Mail className="w-4 h-4" />
                },
                {
                  label: 'DKIM',
                  status: result.dkimResult.selectors.every(s => s.type === 'valid') ? 'valid' as const : 'warning' as const,
                  hasIssues: result.dkimResult.selectors.some(s => getDkimIssues(s).length > 0),
                  icon: <Key className="w-4 h-4" />
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-lg border p-3 text-center ${
                    item.status === 'valid' && !item.hasIssues
                      ? 'bg-green-50 border-green-200'
                      : item.status === 'error'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    item.status === 'valid' && !item.hasIssues
                      ? 'bg-green-100 text-green-600'
                      : item.status === 'error'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {item.status === 'valid' && !item.hasIssues ? (
                      <Check className="w-4 h-4" />
                    ) : item.status === 'error' ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="text-sm font-medium text-[#171717]">{item.label}</div>
                  <div className={`text-xs ${
                    item.status === 'valid' && !item.hasIssues
                      ? 'text-green-700'
                      : item.status === 'error'
                      ? 'text-red-700'
                      : 'text-yellow-700'
                  }`}>
                    {getStatusText(item.status, item.hasIssues)}
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Results */}
            <div className="bg-white rounded-lg border border-[#e5e5e5]">
              <Accordion type="multiple" className="w-full">
                {/* DMARC */}
                <AccordionItem value="dmarc" className="border-b">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="text-sm font-medium">DMARC</span>
                      <StatusIcon status={dmarcIssues.length > 0 ? 'warning' : getStatus(result.dmarcResult.type)} />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      <div className="bg-[#f5f5f5] rounded p-3">
                        <code className="text-xs break-all">{result.dmarcResult.record || 'No record found'}</code>
                      </div>
                      {dmarcIssues.length > 0 && (
                        <div className="space-y-1">
                          {dmarcIssues.map((issue, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-yellow-800">
                              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                              {issue}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* SPF */}
                <AccordionItem value="spf" className="border-b">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="text-sm font-medium">SPF</span>
                      <StatusIcon status={spfIssues.length > 0 ? 'warning' : getStatus(result.spfResult.type)} />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      <div className="bg-[#f5f5f5] rounded p-3">
                        <code className="text-xs break-all">{result.spfResult.record || 'No record found'}</code>
                      </div>
                      {spfIssues.length > 0 && (
                        <div className="space-y-1">
                          {spfIssues.map((issue, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-yellow-800">
                              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                              {issue}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* DKIM Selectors */}
                {result.dkimResult.selectors.map((selector, index) => {
                  const selectorName = selector.selector.split('.')[0];
                  const issues = getDkimIssues(selector);
                  return (
                    <AccordionItem key={index} value={`dkim-${index}`} className="border-b last:border-b-0">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="text-sm font-medium">DKIM - {selectorName}</span>
                          <StatusIcon status={issues.length > 0 ? 'warning' : getStatus(selector.type)} />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-3">
                          <div className="text-xs text-[#737373] mb-1">{selector.selector}</div>
                          <div className="bg-[#f5f5f5] rounded p-3">
                            <code className="text-xs break-all">{selector.record || 'No record found'}</code>
                          </div>
                          {issues.length > 0 && (
                            <div className="space-y-1">
                              {issues.map((issue, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-yellow-800">
                                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                                  {issue}
                                </div>
                              ))}
                            </div>
                          )}
                          {issues.length === 0 && (
                            <div className="flex items-center gap-2 text-xs text-green-700">
                              <Check className="w-3 h-3" />
                              All checks passed
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>

            {/* CTA */}
            <div className="bg-[#171717] rounded-lg p-6 text-center">
              <h3 className="text-white font-medium mb-2">Need help fixing issues?</h3>
              <p className="text-sm text-[#a3a3a3] mb-4">
                Use our DMARC generator to create a properly configured record.
              </p>
              <Link href="/tools/dmarc-generator">
                <Button className="bg-[#22c55e] hover:bg-[#16a34a]">
                  Generate DMARC Record
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#a3a3a3]" />
            </div>
            <h3 className="font-medium text-[#525252] mb-1">Enter a domain to check</h3>
            <p className="text-sm text-[#a3a3a3]">
              We&apos;ll analyze DMARC, SPF, and DKIM records
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] py-4 bg-white mt-auto">
        <div className="max-w-2xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#171717] flex items-center justify-center">
              <MailIcon className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-xs font-medium">MailTail</span>
          </Link>
          <span className="text-xs text-[#a3a3a3]">Free email tools</span>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Check, Copy, Plus, X, ChevronDown, Shield, Mail, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type Policy = 'none' | 'quarantine' | 'reject';
type Alignment = 'r' | 's';
type FailureOption = '0' | '1' | 'd' | 's';

interface DMARCConfig {
  policy: Policy;
  subdomainPolicy: Policy | '';
  ruaEmails: string[];
  rufEmails: string[];
  percentage: number;
  adkim: Alignment;
  aspf: Alignment;
  reportInterval: number;
  failureOptions: FailureOption[];
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export default function DMARCGenerator() {
  const [config, setConfig] = useState<DMARCConfig>({
    policy: 'none',
    subdomainPolicy: '',
    ruaEmails: [''],
    rufEmails: [],
    percentage: 100,
    adkim: 'r',
    aspf: 'r',
    reportInterval: 86400,
    failureOptions: ['0'],
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [domain, setDomain] = useState('');

  const dmarcRecord = useMemo(() => {
    const parts: string[] = ['v=DMARC1'];
    parts.push(`p=${config.policy}`);
    if (config.subdomainPolicy) parts.push(`sp=${config.subdomainPolicy}`);
    const validRuaEmails = config.ruaEmails.filter(e => e.trim());
    if (validRuaEmails.length > 0) {
      parts.push(`rua=${validRuaEmails.map(e => `mailto:${e.trim()}`).join(',')}`);
    }
    const validRufEmails = config.rufEmails.filter(e => e.trim());
    if (validRufEmails.length > 0) {
      parts.push(`ruf=${validRufEmails.map(e => `mailto:${e.trim()}`).join(',')}`);
    }
    if (config.percentage !== 100) parts.push(`pct=${config.percentage}`);
    if (config.adkim !== 'r') parts.push(`adkim=${config.adkim}`);
    if (config.aspf !== 'r') parts.push(`aspf=${config.aspf}`);
    if (config.reportInterval !== 86400) parts.push(`ri=${config.reportInterval}`);
    if (config.failureOptions.length > 0 && !(config.failureOptions.length === 1 && config.failureOptions[0] === '0')) {
      parts.push(`fo=${config.failureOptions.join(':')}`);
    }
    return parts.join('; ');
  }, [config]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(dmarcRecord);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addEmail = (type: 'rua' | 'ruf') => {
    const key = type === 'rua' ? 'ruaEmails' : 'rufEmails';
    setConfig(prev => ({ ...prev, [key]: [...prev[key], ''] }));
  };

  const removeEmail = (type: 'rua' | 'ruf', index: number) => {
    const key = type === 'rua' ? 'ruaEmails' : 'rufEmails';
    setConfig(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  const updateEmail = (type: 'rua' | 'ruf', index: number, value: string) => {
    const key = type === 'rua' ? 'ruaEmails' : 'rufEmails';
    setConfig(prev => ({ ...prev, [key]: prev[key].map((e, i) => (i === index ? value : e)) }));
  };

  const toggleFailureOption = (option: FailureOption) => {
    setConfig(prev => ({
      ...prev,
      failureOptions: prev.failureOptions.includes(option)
        ? prev.failureOptions.filter(o => o !== option)
        : [...prev.failureOptions, option],
    }));
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
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
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-xs h-7">
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Badge variant="secondary" className="mb-2 text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Free Tool
          </Badge>
          <h1 className="text-2xl font-bold mb-1">DMARC Record Generator</h1>
          <p className="text-sm text-[#737373]">
            Create a DMARC policy to protect against email spoofing.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg border border-[#e5e5e5] divide-y divide-[#e5e5e5]">
          {/* Domain */}
          <div className="p-4">
            <Label className="text-sm font-medium mb-1.5 block">Domain</Label>
            <Input
              type="text"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="h-9"
            />
          </div>

          {/* Policy */}
          <div className="p-4">
            <Label className="text-sm font-medium mb-2 block">Policy</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'none', label: 'None', desc: 'Monitor only', color: 'text-blue-600' },
                { value: 'quarantine', label: 'Quarantine', desc: 'Mark as spam', color: 'text-amber-600' },
                { value: 'reject', label: 'Reject', desc: 'Block email', color: 'text-red-600' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setConfig(prev => ({ ...prev, policy: opt.value as Policy }))}
                  className={`p-2.5 rounded-md border text-left transition-all ${
                    config.policy === opt.value
                      ? 'border-[#22c55e] bg-[#f0fdf4]'
                      : 'border-[#e5e5e5] hover:border-[#d4d4d4]'
                  }`}
                >
                  <div className={`text-sm font-medium ${config.policy === opt.value ? 'text-[#171717]' : opt.color}`}>
                    {opt.label}
                  </div>
                  <div className="text-xs text-[#737373]">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Report Emails */}
          <div className="p-4">
            <Label className="text-sm font-medium mb-1.5 block">
              Aggregate report emails <span className="text-[#a3a3a3] font-normal">(rua)</span>
            </Label>
            <div className="space-y-2">
              {config.ruaEmails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="dmarc@example.com"
                    value={email}
                    onChange={(e) => updateEmail('rua', index, e.target.value)}
                    className="h-9"
                  />
                  {config.ruaEmails.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeEmail('rua', index)} className="h-9 w-9 shrink-0">
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => addEmail('rua')} className="h-7 text-xs text-[#737373]">
                <Plus className="w-3 h-3 mr-1" />
                Add another email
              </Button>
            </div>
          </div>

          {/* Percentage */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">
                Percentage of emails to apply policy to
              </Label>
              <span className="text-sm font-medium">{config.percentage}%</span>
            </div>
            <Slider
              value={[config.percentage]}
              onValueChange={([value]) => setConfig(prev => ({ ...prev, percentage: value }))}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-[#a3a3a3] mt-1.5">Start with a lower percentage for testing (e.g. 10%)</p>
          </div>

          {/* Advanced Options */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-[#fafafa] transition-colors">
              <span className="text-sm font-medium">Advanced options</span>
              <ChevronDown className={`w-4 h-4 text-[#737373] transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 space-y-4">
                {/* Subdomain Policy */}
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">
                    Subdomain policy <span className="text-[#a3a3a3] font-normal">(sp)</span>
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { value: '', label: 'Inherit' },
                      { value: 'none', label: 'None' },
                      { value: 'quarantine', label: 'Quarantine' },
                      { value: 'reject', label: 'Reject' },
                    ].map((opt) => (
                      <Button
                        key={opt.value}
                        variant={config.subdomainPolicy === opt.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setConfig(prev => ({ ...prev, subdomainPolicy: opt.value as Policy | '' }))}
                        className={`h-7 text-xs ${config.subdomainPolicy === opt.value ? 'bg-[#22c55e] hover:bg-[#16a34a]' : ''}`}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Forensic Reports */}
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">
                    Forensic report emails <span className="text-[#a3a3a3] font-normal">(ruf)</span>
                  </Label>
                  <div className="space-y-2">
                    {config.rufEmails.length === 0 ? (
                      <Button variant="ghost" size="sm" onClick={() => addEmail('ruf')} className="h-7 text-xs text-[#737373]">
                        <Plus className="w-3 h-3 mr-1" />
                        Add forensic email
                      </Button>
                    ) : (
                      <>
                        {config.rufEmails.map((email, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              type="email"
                              placeholder="forensic@example.com"
                              value={email}
                              onChange={(e) => updateEmail('ruf', index, e.target.value)}
                              className="h-9"
                            />
                            <Button variant="ghost" size="icon" onClick={() => removeEmail('ruf', index)} className="h-9 w-9 shrink-0">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="ghost" size="sm" onClick={() => addEmail('ruf')} className="h-7 text-xs text-[#737373]">
                          <Plus className="w-3 h-3 mr-1" />
                          Add another
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Alignment */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">DKIM alignment</Label>
                    <div className="flex gap-1.5">
                      {[{ value: 'r', label: 'Relaxed' }, { value: 's', label: 'Strict' }].map((opt) => (
                        <Button
                          key={opt.value}
                          variant={config.adkim === opt.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setConfig(prev => ({ ...prev, adkim: opt.value as Alignment }))}
                          className={`h-7 text-xs flex-1 ${config.adkim === opt.value ? 'bg-[#22c55e] hover:bg-[#16a34a]' : ''}`}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">SPF alignment</Label>
                    <div className="flex gap-1.5">
                      {[{ value: 'r', label: 'Relaxed' }, { value: 's', label: 'Strict' }].map((opt) => (
                        <Button
                          key={opt.value}
                          variant={config.aspf === opt.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setConfig(prev => ({ ...prev, aspf: opt.value as Alignment }))}
                          className={`h-7 text-xs flex-1 ${config.aspf === opt.value ? 'bg-[#22c55e] hover:bg-[#16a34a]' : ''}`}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Report Interval */}
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">
                    Report interval <span className="text-[#a3a3a3] font-normal">(seconds)</span>
                  </Label>
                  <Input
                    type="number"
                    value={config.reportInterval}
                    onChange={(e) => setConfig(prev => ({ ...prev, reportInterval: parseInt(e.target.value) || 86400 }))}
                    className="h-9 max-w-[140px]"
                  />
                </div>

                {/* Failure Options */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Failure reporting options</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: '0', label: 'All fail (fo=0)' },
                      { value: '1', label: 'Any fail (fo=1)' },
                      { value: 'd', label: 'DKIM fail (fo=d)' },
                      { value: 's', label: 'SPF fail (fo=s)' },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2 p-2 rounded border border-[#e5e5e5] cursor-pointer hover:bg-[#fafafa]"
                      >
                        <Checkbox
                          checked={config.failureOptions.includes(opt.value as FailureOption)}
                          onCheckedChange={() => toggleFailureOption(opt.value as FailureOption)}
                        />
                        <span className="text-xs">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Output Section */}
        <div className="mt-6 bg-white rounded-lg border border-[#e5e5e5] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-medium">DNS TXT record value</h2>
              <p className="text-xs text-[#737373]">
                Add this as a TXT record at <code className="bg-[#f5f5f5] px-1 rounded">_dmarc.{domain || 'yourdomain.com'}</code>
              </p>
            </div>
          </div>

          <div className="bg-[#f5f5f5] rounded-md p-3 mb-3">
            <code className="text-sm font-mono text-[#171717] break-all leading-relaxed">
              {dmarcRecord}
            </code>
          </div>

          <Button
            onClick={copyToClipboard}
            className={`w-full h-9 ${copied ? 'bg-[#22c55e] hover:bg-[#16a34a]' : ''}`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied to clipboard
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy to clipboard
              </>
            )}
          </Button>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: <Mail className="w-4 h-4" />, title: 'Step 1', desc: 'Copy the record above' },
            { icon: <Shield className="w-4 h-4" />, title: 'Step 2', desc: 'Add TXT record at _dmarc' },
            { icon: <AlertTriangle className="w-4 h-4" />, title: 'Step 3', desc: 'Wait 24-48h to propagate' },
          ].map((tip, i) => (
            <div key={i} className="bg-white rounded-lg border border-[#e5e5e5] p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-[#f0fdf4] flex items-center justify-center mx-auto mb-2 text-[#22c55e]">
                {tip.icon}
              </div>
              <div className="text-xs font-medium">{tip.title}</div>
              <div className="text-xs text-[#737373]">{tip.desc}</div>
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Pro tip:</strong> Start with &quot;None&quot; policy to monitor authentication without affecting delivery, then gradually move to &quot;Quarantine&quot; and &quot;Reject&quot;.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] py-4 mt-8 bg-white">
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

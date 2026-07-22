'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Briefcase,
  DollarSign,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

const STEPS = [
  { id: 1, label: 'Overview', icon: FileText },
  { id: 2, label: 'Requirements', icon: Briefcase },
  { id: 3, label: 'Budget & Schedule', icon: DollarSign },
  { id: 4, label: 'Contact', icon: Mail },
  { id: 5, label: 'Review', icon: Check },
];

const SERVICE_TYPES = [
  'Full-Stack Web Development',
  'Frontend Development',
  'Backend Development',
  'Security Engineering',
  'Cloud Deployment & DevOps',
  'API Design',
  'Database Design',
  'Mobile App Development',
  'Other',
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'NPR', 'AUD', 'CAD'];

type FormData = {
  title: string;
  service_type: string;
  description: string;
  reference_url: string;
  required_features: string;
  preferred_technologies: string;
  target_platforms: string;
  design_status: string;
  budget_min: string;
  budget_max: string;
  currency: string;
  preferred_start_date: string;
  target_completion_date: string;
  flexibility: string;
  name: string;
  email: string;
  company: string;
  country: string;
  phone: string;
  preferred_contact_method: string;
  terms: boolean;
};

const initialForm: FormData = {
  title: '',
  service_type: '',
  description: '',
  reference_url: '',
  required_features: '',
  preferred_technologies: '',
  target_platforms: '',
  design_status: '',
  budget_min: '',
  budget_max: '',
  currency: 'USD',
  preferred_start_date: '',
  target_completion_date: '',
  flexibility: '',
  name: '',
  email: '',
  company: '',
  country: '',
  phone: '',
  preferred_contact_method: 'email',
  terms: false,
};

export function JobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sourceProject = searchParams.get('source') || null;
  const { user, profile } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>(initialForm);

  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        name: profile.full_name || prev.name,
        email: profile.email || prev.email,
        company: profile.company || prev.company,
        country: profile.country || prev.country,
        phone: profile.phone || prev.phone,
      }));
    }
  }, [profile]);

  const updateForm = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return Boolean(form.title && form.service_type && form.description);
      case 2:
        return Boolean(form.required_features);
      case 3:
        return Boolean(form.budget_min && form.budget_max);
      case 4:
        return Boolean(form.name && form.email && form.country);
      case 5:
        return form.terms;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!form.terms) {
      toast.error('Please accept the terms to continue.');
      return;
    }

    setLoading(true);
    try {
      const idempotencyKey = crypto.randomUUID();

      const { error } = await supabase.from('job_requests').insert({
        idempotency_key: idempotencyKey,
        user_id: user?.id || null,
        title: form.title,
        description: form.description,
        service_type: form.service_type,
        budget_min_cents: form.budget_min
          ? Math.round(parseFloat(form.budget_min) * 100)
          : null,
        budget_max_cents: form.budget_max
          ? Math.round(parseFloat(form.budget_max) * 100)
          : null,
        currency: form.currency,
        preferred_start_date: form.preferred_start_date || null,
        target_completion_date: form.target_completion_date || null,
        flexibility: form.flexibility || null,
        name: form.name,
        email: form.email,
        company: form.company || null,
        country: form.country,
        phone: form.phone || null,
        preferred_contact_method: form.preferred_contact_method,
        status: 'SUBMITTED',
        source_project_slug: sourceProject,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success('Job request submitted successfully!');
    } catch {
      toast.error('Failed to submit job request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success animate-scale-in">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-2xl font-bold">Job request submitted!</h2>
        <p className="mt-3 text-muted-foreground">
          Thank you, {form.name.split(' ')[0]}. We&apos;ve received your project
          requirements for &ldquo;{form.title}&rdquo; and will review them
          shortly. You&apos;ll receive a response at{' '}
          <span className="font-medium text-foreground">{form.email}</span>{' '}
          within 24 hours.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={() => router.push('/projects')}>
            Browse more projects
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setForm(initialForm);
              setSubmitted(false);
              setStep(1);
            }}
          >
            Submit another request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  step >= s.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground'
                }`}
              >
                {step > s.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <s.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  step >= s.id ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 transition-colors ${
                  step > s.id ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-xl border bg-card p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Project Overview</h2>
            <div className="space-y-2">
              <Label htmlFor="title">Project title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
                placeholder="e.g., E-commerce platform with payment integration"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service_type">Service required *</Label>
              <Select
                value={form.service_type}
                onValueChange={(v) => updateForm('service_type', v)}
              >
                <SelectTrigger id="service_type">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Short description *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="Briefly describe what you want to build..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference_url">Existing website or reference URL</Label>
              <Input
                id="reference_url"
                type="url"
                value={form.reference_url}
                onChange={(e) => updateForm('reference_url', e.target.value)}
                placeholder="https://example.com (optional)"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Requirements</h2>
            <div className="space-y-2">
              <Label htmlFor="required_features">Required features *</Label>
              <Textarea
                id="required_features"
                value={form.required_features}
                onChange={(e) => updateForm('required_features', e.target.value)}
                placeholder="List the key features you need, one per line..."
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_technologies">Preferred technologies</Label>
              <Input
                id="preferred_technologies"
                value={form.preferred_technologies}
                onChange={(e) => updateForm('preferred_technologies', e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_platforms">Target platforms</Label>
              <Input
                id="target_platforms"
                value={form.target_platforms}
                onChange={(e) => updateForm('target_platforms', e.target.value)}
                placeholder="e.g., Web, iOS, Android (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="design_status">Design status</Label>
              <Select
                value={form.design_status}
                onValueChange={(v) => updateForm('design_status', v)}
              >
                <SelectTrigger id="design_status">
                  <SelectValue placeholder="Select design status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_design">No design yet</SelectItem>
                  <SelectItem value="wireframes">Wireframes ready</SelectItem>
                  <SelectItem value="design_ready">Design ready (Figma, etc.)</SelectItem>
                  <SelectItem value="existing">Redesigning existing app</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Budget & Schedule</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budget_min">Minimum budget *</Label>
                <Input
                  id="budget_min"
                  type="number"
                  min="0"
                  value={form.budget_min}
                  onChange={(e) => updateForm('budget_min', e.target.value)}
                  placeholder="1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget_max">Maximum budget *</Label>
                <Input
                  id="budget_max"
                  type="number"
                  min="0"
                  value={form.budget_max}
                  onChange={(e) => updateForm('budget_max', e.target.value)}
                  placeholder="5000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={form.currency}
                onValueChange={(v) => updateForm('currency', v)}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="preferred_start_date">Preferred start date</Label>
                <Input
                  id="preferred_start_date"
                  type="date"
                  value={form.preferred_start_date}
                  onChange={(e) => updateForm('preferred_start_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_completion_date">Target completion date</Label>
                <Input
                  id="target_completion_date"
                  type="date"
                  value={form.target_completion_date}
                  onChange={(e) => updateForm('target_completion_date', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="flexibility">Schedule flexibility</Label>
              <Select
                value={form.flexibility}
                onValueChange={(v) => updateForm('flexibility', v)}
              >
                <SelectTrigger id="flexibility">
                  <SelectValue placeholder="How flexible is your timeline?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">Flexible — quality over speed</SelectItem>
                  <SelectItem value="moderate">Moderate — some room to adjust</SelectItem>
                  <SelectItem value="fixed">Fixed — hard deadline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company (optional)</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => updateForm('company', e.target.value)}
                  placeholder="Your company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={(e) => updateForm('country', e.target.value)}
                  placeholder="e.g., Nepal, India, USA"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone / WhatsApp (optional)</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="+977-98XXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferred_contact_method">Preferred contact method</Label>
                <Select
                  value={form.preferred_contact_method}
                  onValueChange={(v) => updateForm('preferred_contact_method', v)}
                >
                  <SelectTrigger id="preferred_contact_method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold">Review & Submit</h2>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold text-primary">Overview</h3>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Title:</dt>
                    <dd className="font-medium">{form.title}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Service:</dt>
                    <dd className="font-medium">{form.service_type}</dd>
                  </div>
                  {form.reference_url && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Reference:</dt>
                      <dd className="font-medium truncate ml-4">{form.reference_url}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold text-primary">Requirements</h3>
                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                  {form.required_features}
                </p>
                {form.preferred_technologies && (
                  <p className="mt-2 text-sm">
                    <span className="text-muted-foreground">Technologies:</span>{' '}
                    {form.preferred_technologies}
                  </p>
                )}
                {form.target_platforms && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Platforms:</span>{' '}
                    {form.target_platforms}
                  </p>
                )}
                {form.design_status && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Design:</span>{' '}
                    {form.design_status}
                  </p>
                )}
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold text-primary">Budget & Schedule</h3>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Budget:</dt>
                    <dd className="font-medium">
                      {form.currency} {form.budget_min} — {form.budget_max}
                    </dd>
                  </div>
                  {form.preferred_start_date && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Start:</dt>
                      <dd className="font-medium">{form.preferred_start_date}</dd>
                    </div>
                  )}
                  {form.target_completion_date && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Deadline:</dt>
                      <dd className="font-medium">{form.target_completion_date}</dd>
                    </div>
                  )}
                  {form.flexibility && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Flexibility:</dt>
                      <dd className="font-medium">{form.flexibility}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold text-primary">Contact</h3>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Name:</dt>
                    <dd className="font-medium">{form.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Email:</dt>
                    <dd className="font-medium">{form.email}</dd>
                  </div>
                  {form.company && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Company:</dt>
                      <dd className="font-medium">{form.company}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Country:</dt>
                    <dd className="font-medium">{form.country}</dd>
                  </div>
                  {form.phone && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Phone:</dt>
                      <dd className="font-medium">{form.phone}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Contact via:</dt>
                    <dd className="font-medium">{form.preferred_contact_method}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={form.terms}
                onCheckedChange={(v) => updateForm('terms', v === true)}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the{' '}
                <a href="/terms" className="text-primary hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </Label>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1 || loading}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {step < 5 ? (
          <Button
            onClick={() => setStep((s) => Math.min(5, s + 1))}
            disabled={!canProceed()}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading || !form.terms}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Submitting...' : 'Submit Job Request'}
          </Button>
        )}
      </div>
    </div>
  );
}

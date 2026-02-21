'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, MapPin, Clock, MessageCircle, Send, Calendar, CheckCircle } from 'lucide-react';
import { Container, Section, Card, CardContent, Input, Textarea, Checkbox, Button } from '@/components/ui';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

interface FormData {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
  whatsapp: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  company: '',
  topic: '',
  message: '',
  whatsapp: false,
};

export default function ContactPage() {
  const t = useTranslations('contact');

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('errors.name_required');
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errors.email_required');
    }

    if (!formData.topic) {
      newErrors.topic = t('errors.topic_required');
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = formData.message.trim().length > 0
        ? t('errors.message_too_short')
        : t('errors.message_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setTicketId(data.ticketId || `AV-${Date.now().toString(36).toUpperCase()}`);
        setIsSuccess(true);
      } else {
        setErrors({ message: t('errors.send_failed') });
      }
    } catch {
      setErrors({ message: t('errors.send_failed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const topicOptions = [
    { value: 'general', label: t('form.topics.general') },
    { value: 'project', label: t('form.topics.project') },
    { value: 'estimate', label: t('form.topics.estimate') },
    { value: 'support', label: t('form.topics.support') },
    { value: 'partnership', label: t('form.topics.partnership') },
    { value: 'other', label: t('form.topics.other') },
  ];

  const handleSendAnother = () => {
    setIsSuccess(false);
    setFormData(initialFormData);
    setErrors({});
    setTicketId('');
  };

  return (
    <div className="min-h-screen bg-navy">
      {/* Breadcrumbs */}
      <Section padding="compact">
        <Container>
          <Breadcrumbs />
        </Container>
      </Section>

      {/* Hero */}
      <Section padding="hero">
        <Container>
          <SectionHeading
            label={t('page.label')}
            title={t('page.title')}
            subtitle={t('page.subtitle')}
          />
        </Container>
      </Section>

      {/* Two-Column Layout: Form + Info */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Form (3 columns) */}
            <div className="lg:col-span-3">
              {isSuccess ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      </div>
                      <h2 className="text-h2 text-white">{t('success.title')}</h2>
                      <p className="text-lg text-muted mt-4">{t('success.message')}</p>
                      {ticketId && (
                        <p className="text-sm text-bronze mt-4 font-mono bg-slate-blue rounded-lg px-4 py-2 inline-block">
                          {t('success.reference')} {ticketId}
                        </p>
                      )}
                      <div className="mt-8">
                        <Button
                          variant="secondary"
                          size="lg"
                          onClick={handleSendAnother}
                          leftIcon={<Send className="h-4 w-4" />}
                        >
                          {t('form.send_another')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold text-white mb-6">
                    {t('page.form_title')}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label={t('form.name_label')}
                        placeholder={t('form.name_placeholder')}
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        error={errors.name}
                      />
                      <Input
                        label={t('form.email_label')}
                        type="email"
                        placeholder={t('form.email_placeholder')}
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        error={errors.email}
                      />
                    </div>

                    {/* Company */}
                    <Input
                      label={t('form.company_label')}
                      placeholder={t('form.company_placeholder')}
                      value={formData.company}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, company: e.target.value }))
                      }
                    />

                    {/* Topic Select */}
                    <div className="w-full space-y-2">
                      <label className="block text-sm font-medium text-off-white">
                        {t('form.topic_label')}
                        <span className="text-error ms-1" aria-label={t('form.aria_required')}>*</span>
                      </label>
                      <Select
                        value={formData.topic}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, topic: value }))
                        }
                      >
                        <SelectTrigger error={errors.topic}>
                          <SelectValue placeholder={t('form.topic_placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {topicOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message */}
                    <Textarea
                      label={t('form.message_label')}
                      placeholder={t('form.message_placeholder')}
                      required
                      maxLength={2000}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, message: e.target.value }))
                      }
                      error={errors.message}
                    />

                    {/* WhatsApp Checkbox */}
                    <Checkbox
                      label={t('form.whatsapp_label')}
                      checked={formData.whatsapp}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, whatsapp: checked === true }))
                      }
                    />

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      isLoading={isSubmitting}
                      rightIcon={<Send />}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? t('form.submitting') : t('form.submit')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              )}
            </div>

            {/* Contact Info Sidebar (2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info Cards */}
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <h3 className="text-lg font-semibold text-white">
                    {t('info.heading')}
                  </h3>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-bronze/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-bronze" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-off-white">
                        {t('info.email')}
                      </p>
                      <a
                        href={`mailto:${t('info.email_value')}`}
                        className="text-sm text-muted hover:text-bronze transition-colors"
                        dir="ltr"
                      >
                        <span className="[unicode-bidi:embed]">{t('info.email_value')}</span>
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-off-white">
                        {t('info.whatsapp')}
                      </p>
                      <p className="text-sm text-muted" dir="ltr">
                        <span className="[unicode-bidi:embed]">{t('info.whatsapp_value')}</span>
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-off-white">
                        {t('info.location')}
                      </p>
                      <p className="text-sm text-muted">
                        {t('info.location_value')}
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-off-white">
                        {t('info.hours')}
                      </p>
                      <p className="text-sm text-muted">
                        {t('info.hours_value')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calendly Placeholder */}
              <Card variant="featured">
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-bronze/10 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-6 w-6 text-bronze" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {t('page.calendly_title')}
                  </h3>
                  <p className="text-sm text-muted mt-2">
                    {t('page.calendly_description')}
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="mt-6 w-full"
                    aria-label={t('page.calendly_aria')}
                    onClick={() => {
                      // Open Calendly booking
                      window.open('https://calendly.com/aliodat-aviniti/30min', '_blank');
                    }}
                  >
                    <Calendar className="h-4 w-4 me-2" />
                    {t('page.calendly_cta')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

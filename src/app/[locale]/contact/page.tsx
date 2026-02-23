'use client';

import { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { trackContactCaptureStarted, trackContactCaptureSubmitted } from '@/lib/analytics';
import { Mail, MapPin, Clock, MessageCircle, Send, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { Container, Section, Input, Textarea, Checkbox, Button } from '@/components/ui';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PhoneInput } from 'react-international-phone';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import 'react-international-phone/style.css';

interface FormData {
  name: string;
  phone: string;
  email: string;
  company: string;
  topic: string;
  message: string;
  whatsapp: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  topic?: string;
  message?: string;
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  company: '',
  topic: '',
  message: '',
  whatsapp: false,
};

/* ─── Contact info items config ─── */
const contactItems = [
  {
    key: 'email',
    icon: Mail,
    color: 'rgba(192, 132, 96, 1)',       // bronze
    bgColor: 'rgba(192, 132, 96, 0.15)',
    borderColor: 'rgba(192, 132, 96, 0.15)',
    hoverBorder: 'rgba(192, 132, 96, 0.4)',
    glowColor: 'rgba(192, 132, 96, 0.1)',
    isLink: true,
    linkPrefix: 'mailto:',
    valueKey: 'info.email_value',
    labelKey: 'info.email',
    textClass: 'text-bronze',
  },
  {
    key: 'whatsapp',
    icon: MessageCircle,
    color: 'rgba(74, 222, 128, 1)',        // green
    bgColor: 'rgba(74, 222, 128, 0.15)',
    borderColor: 'rgba(74, 222, 128, 0.15)',
    hoverBorder: 'rgba(74, 222, 128, 0.4)',
    glowColor: 'rgba(74, 222, 128, 0.1)',
    isLink: false,
    valueKey: 'info.whatsapp_value',
    labelKey: 'info.whatsapp',
    textClass: 'text-green-400',
  },
  {
    key: 'location',
    icon: MapPin,
    color: 'rgba(96, 165, 250, 1)',        // blue
    bgColor: 'rgba(96, 165, 250, 0.15)',
    borderColor: 'rgba(96, 165, 250, 0.15)',
    hoverBorder: 'rgba(96, 165, 250, 0.4)',
    glowColor: 'rgba(96, 165, 250, 0.1)',
    isLink: false,
    valueKey: 'info.location_value',
    labelKey: 'info.location',
    textClass: 'text-blue-400',
  },
  {
    key: 'hours',
    icon: Clock,
    color: 'rgba(168, 85, 247, 1)',        // purple
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: 'rgba(168, 85, 247, 0.15)',
    hoverBorder: 'rgba(168, 85, 247, 0.4)',
    glowColor: 'rgba(168, 85, 247, 0.1)',
    isLink: false,
    valueKey: 'info.hours_value',
    labelKey: 'info.hours',
    textClass: 'text-purple-400',
  },
] as const;

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const hasTrackedStart = useRef(false);
  const handleFormInteraction = useCallback(() => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackContactCaptureStarted('contact_page', locale);
    }
  }, [locale]);

  // Auto-detect country from Vercel geo cookie
  const [defaultCountry, setDefaultCountry] = useState('jo');
  useEffect(() => {
    const match = document.cookie.match(/geo-country=([A-Z]{2})/);
    if (match) setDefaultCountry(match[1].toLowerCase());
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('errors.name_required');
    }

    // Phone is required and must be valid
    if (!formData.phone || formData.phone.length <= 4) {
      newErrors.phone = t('form.phone_error');
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = t('form.phone_error');
    }

    // Email is optional — only validate format if provided
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          company: formData.company || undefined,
          topic: formData.topic,
          message: formData.message,
          whatsapp: formData.whatsapp,
          locale: document.documentElement.lang || 'en',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTicketId(data.ticketId || `AV-${Date.now().toString(36).toUpperCase()}`);
        setIsSuccess(true);
        trackContactCaptureSubmitted('contact_page', locale);
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
      {/* ─── Breadcrumbs (compact) ─── */}
      <Section padding="compact">
        <Container>
          <Breadcrumbs />
        </Container>
      </Section>

      {/* ─── Main Content — No separate hero, form is immediately visible ─── */}
      <Section padding="compact">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

            {/* ─── LEFT COLUMN: Form (3 cols) ─── */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {isSuccess ? (
                  /* ══════ SUCCESS STATE ══════ */
                  <div
                    className="relative overflow-hidden"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '16px',
                    }}
                  >
                    {/* Accent line */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #4ade80, transparent)',
                      }}
                    />

                    <div className="text-center px-8 py-16">
                      {/* Animated checkmark */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 10 }}
                        className="h-20 w-20 rounded-full mx-auto mb-8 flex items-center justify-center"
                        style={{
                          background: 'rgba(74, 222, 128, 0.12)',
                          boxShadow: '0 0 40px rgba(74, 222, 128, 0.25), inset 0 0 20px rgba(74, 222, 128, 0.1)',
                        }}
                      >
                        <CheckCircle className="h-10 w-10 text-green-400" />
                      </motion.div>

                      <h2 className="text-2xl font-bold text-white">{t('success.title')}</h2>
                      <p className="text-base text-muted mt-3 max-w-md mx-auto">{t('success.message')}</p>

                      {ticketId && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-6 inline-block"
                        >
                          <div
                            style={{
                              background: 'rgba(192, 132, 96, 0.08)',
                              border: '1px solid rgba(192, 132, 96, 0.25)',
                              borderRadius: '8px',
                            }}
                            className="px-5 py-3"
                          >
                            <p className="text-xs text-muted mb-1">{t('success.reference')}</p>
                            <p className="font-mono text-bronze text-base font-semibold">{ticketId}</p>
                          </div>
                        </motion.div>
                      )}

                      <div className="mt-8">
                        <Button
                          onClick={handleSendAnother}
                          leftIcon={<Send className="h-4 w-4" />}
                          className="bg-white/[0.06] hover:bg-white/[0.1] text-off-white border border-white/[0.1] hover:border-white/[0.2] transition-all"
                        >
                          {t('form.send_another')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ══════ FORM CARD ══════ */
                  <div
                    className="relative overflow-hidden"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '16px',
                    }}
                  >
                    {/* Bronze accent line */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #C08460, transparent)',
                      }}
                    />

                    <div className="p-6 sm:p-8">
                      {/* ─── Inline Hero: Title + Subtitle inside card ─── */}
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: '#C08460' }}
                          />
                          <span className="text-xs font-semibold uppercase tracking-widest text-bronze">
                            {t('page.label')}
                          </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                          {t('page.title')}
                        </h1>
                        <p className="text-sm sm:text-base text-muted max-w-lg">
                          {t('page.subtitle')}
                        </p>
                      </div>

                      {/* ─── Divider ─── */}
                      <div
                        className="mb-8"
                        style={{
                          height: '1px',
                          background: 'linear-gradient(90deg, rgba(192,132,96,0.3), rgba(255,255,255,0.06), transparent)',
                        }}
                      />

                      {/* ─── Form ─── */}
                      <form onSubmit={handleSubmit} onFocus={handleFormInteraction} className="space-y-5" noValidate>
                        {/* Name + Phone row on desktop */}
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

                          {/* Phone */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-off-white">
                              {t('form.phone_label')}
                              <span className="text-error ms-1" aria-label={t('form.aria_required')}>*</span>
                            </label>
                            <div dir="ltr" className="aviniti-phone-input">
                              <PhoneInput
                                defaultCountry={defaultCountry}
                                value={formData.phone}
                                onChange={(value) =>
                                  setFormData((prev) => ({ ...prev, phone: value }))
                                }
                                disabled={isSubmitting}
                                placeholder={t('form.phone_placeholder')}
                                preferredCountries={[
                                  'jo', 'ae', 'sa', 'eg', 'qa', 'kw', 'bh', 'om', 'iq', 'lb', 'ps',
                                ]}
                              />
                            </div>
                            {errors.phone && (
                              <p className="text-xs text-error" role="alert">
                                {errors.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Email + Company row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Input
                              label={t('form.email_label')}
                              type="email"
                              placeholder={t('form.email_placeholder')}
                              value={formData.email}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, email: e.target.value }))
                              }
                              error={errors.email}
                            />
                            <p className="text-xs text-muted-light mt-1.5">
                              {t('form.email_optional_hint')}
                            </p>
                          </div>
                          <Input
                            label={t('form.company_label')}
                            placeholder={t('form.company_placeholder')}
                            value={formData.company}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, company: e.target.value }))
                            }
                          />
                        </div>

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

                        {/* WhatsApp + Submit row */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
                          <Checkbox
                            label={t('form.whatsapp_label')}
                            checked={formData.whatsapp}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({ ...prev, whatsapp: checked === true }))
                            }
                          />

                          <Button
                            type="submit"
                            size="lg"
                            isLoading={isSubmitting}
                            rightIcon={<Send className="h-4 w-4" />}
                            className="w-full sm:w-auto bg-bronze hover:bg-bronze/90 text-white font-semibold transition-all flex-shrink-0"
                            style={{
                              boxShadow: isSubmitting ? 'none' : '0 0 20px rgba(192, 132, 96, 0.25)',
                            }}
                          >
                            {isSubmitting ? t('form.submitting') : t('form.submit')}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* ─── RIGHT COLUMN: Sidebar (2 cols) ─── */}
            <div className="lg:col-span-2 space-y-4">

              {/* ─── Contact Info: 2×2 grid on this column ─── */}
              <ScrollReveal>
                <div
                  className="relative overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '16px',
                  }}
                >
                  {/* Accent line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    }}
                  />

                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-5">
                      {t('info.heading')}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                      {contactItems.map((item) => {
                        const Icon = item.icon;
                        const value = t(item.valueKey);
                        const label = t(item.labelKey);
                        const isLTR = item.key === 'email' || item.key === 'whatsapp';

                        return (
                          <div
                            key={item.key}
                            className="group rounded-xl p-3.5 transition-all duration-200 cursor-default"
                            style={{
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: `1px solid ${item.borderColor}`,
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget.style.borderColor = item.hoverBorder);
                              (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)');
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget.style.borderColor = item.borderColor);
                              (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)');
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: item.bgColor,
                                  boxShadow: `inset 0 0 12px ${item.glowColor}`,
                                }}
                              >
                                <Icon className="h-4 w-4" style={{ color: item.color }} />
                              </div>
                              <div className="min-w-0">
                                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-0.5 ${item.textClass}`}>
                                  {label}
                                </p>
                                {item.isLink ? (
                                  <a
                                    href={`${item.linkPrefix}${value}`}
                                    className="text-xs text-off-white hover:text-bronze transition-colors truncate block"
                                    dir="ltr"
                                  >
                                    <span className="[unicode-bidi:embed]">{value}</span>
                                  </a>
                                ) : (
                                  <p className="text-xs text-off-white truncate" dir={isLTR ? 'ltr' : undefined}>
                                    {isLTR ? <span className="[unicode-bidi:embed]">{value}</span> : value}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* ─── Calendly Card ─── */}
              <ScrollReveal delay={0.15}>
                <div
                  className="relative overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(192, 132, 96, 0.15)',
                    borderRadius: '16px',
                  }}
                >
                  {/* Bronze accent line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #C08460, transparent)',
                    }}
                  />

                  <div className="p-6 text-center">
                    <div
                      className="h-12 w-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                      style={{
                        background: 'rgba(192, 132, 96, 0.15)',
                        boxShadow: '0 0 20px rgba(192, 132, 96, 0.15)',
                      }}
                    >
                      <Calendar className="h-5 w-5 text-bronze" />
                    </div>

                    <h3 className="text-base font-semibold text-white mb-1.5">
                      {t('page.calendly_title')}
                    </h3>
                    <p className="text-xs text-muted mb-5">
                      {t('page.calendly_description')}
                    </p>

                    <Button
                      size="lg"
                      className="w-full bg-bronze hover:bg-bronze/90 text-white font-semibold transition-all"
                      style={{
                        boxShadow: '0 0 20px rgba(192, 132, 96, 0.2)',
                      }}
                      aria-label={t('page.calendly_aria')}
                      onClick={() => {
                        window.open('https://calendly.com/aliodat-aviniti/30min', '_blank');
                      }}
                    >
                      <Calendar className="h-4 w-4 me-2" />
                      {t('page.calendly_cta')}
                    </Button>
                  </div>
                </div>
              </ScrollReveal>

              {/* ─── Quick WhatsApp CTA ─── */}
              <ScrollReveal delay={0.25}>
                <a
                  href={`https://wa.me/962790685302?text=${encodeURIComponent(t('whatsapp.general_message'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl p-4 transition-all duration-200 group"
                  style={{
                    background: 'rgba(74, 222, 128, 0.06)',
                    border: '1px solid rgba(74, 222, 128, 0.15)',
                    borderRadius: '16px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.35)';
                    e.currentTarget.style.background = 'rgba(74, 222, 128, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.15)';
                    e.currentTarget.style.background = 'rgba(74, 222, 128, 0.06)';
                  }}
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-400">WhatsApp</p>
                      <p className="text-xs text-muted" dir="ltr"><span className="[unicode-bidi:embed]">{t('info.whatsapp_value')}</span></p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-green-400/60 group-hover:text-green-400 transition-colors rtl:rotate-180" />
                </a>
              </ScrollReveal>
            </div>

          </div>
        </Container>
      </Section>
    </div>
  );
}

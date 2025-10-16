'use client';

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Calendar,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const contactMethods = [
    {
      icon: Mail,
      title: t('methods.email.title'),
      description: t('methods.email.description'),
      value: 'info@nidal-alrouh.com',
      action: t('methods.email.action'),
    },
    {
      icon: Phone,
      title: t('methods.phone.title'),
      description: t('methods.phone.description'),
      value: '+1 (555) 123-4567',
      action: t('methods.phone.action'),
    },
    {
      icon: MessageSquare,
      title: t('methods.chat.title'),
      description: t('methods.chat.description'),
      value: t('methods.chat.availability'),
      action: t('methods.chat.action'),
    },
    {
      icon: Calendar,
      title: t('methods.appointment.title'),
      description: t('methods.appointment.description'),
      value: t('methods.appointment.availability'),
      action: t('methods.appointment.action'),
    },
  ];

  const officeInfo = [
    {
      icon: MapPin,
      label: t('office.address.label'),
      value: t('office.address.value'),
    },
    {
      icon: Clock,
      label: t('office.hours.label'),
      value: t('office.hours.value'),
    },
    {
      icon: Users,
      label: t('office.team.label'),
      value: t('office.team.value'),
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('hero.subtitle')}
        </p>
      </section>

      {/* Contact Methods */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{method.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                  {method.description}
                </CardDescription>
                <div className="font-medium text-foreground">
                  {method.value}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Contact Form and Office Info */}
      <section className="grid gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t('form.title')}</CardTitle>
            <CardDescription>{t('form.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('form.fields.name.label')}</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={t('form.fields.name.placeholder')}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('form.fields.email.label')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('form.fields.email.placeholder')}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  {t('form.fields.subject.label')}
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder={t('form.fields.subject.placeholder')}
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  {t('form.fields.message.label')}
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder={t('form.fields.message.placeholder')}
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                {t('form.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Office Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('office.title')}</CardTitle>
              <CardDescription>{t('office.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {officeInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {info.label}
                      </div>
                      <div className="text-muted-foreground">{info.value}</div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {t('emergency.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 mb-4">{t('emergency.description')}</p>
              <div className="space-y-2">
                <div className="font-medium text-red-700">
                  {t('emergency.hotline')}: 988
                </div>
                <div className="font-medium text-red-700">
                  {t('emergency.crisis')}: +1 (555) 911-HELP
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t('faq.title')}
          </h2>
          <p className="text-lg text-muted-foreground">{t('faq.subtitle')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('faq.response.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('faq.response.answer')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('faq.services.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('faq.services.answer')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('faq.privacy.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('faq.privacy.answer')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('faq.appointment.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('faq.appointment.answer')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

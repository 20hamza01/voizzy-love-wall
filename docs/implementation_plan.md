# **Voizzy Implementation Plan (MVP)**

## **Stack**

* **Frontend**: Next.js \+ TailwindCSS

* **Backend/Auth**: Supabase

* **Database**: Supabase (PostgreSQL)

## **Phases**

### **Phase 1: Core Functionality**

* Simple email/password sign-up/login

* User dashboard: view, approve, reject, delete testimonials

* Submit testimonial via Voizzy-branded form (text \+ star rating)

* One form per user

* Unique shareable form URL per user

* Embed approved testimonials using iframe bubble widget

* 3-tiered plan logic enforcement

  * Free: 3 testimonials max

  * Basic: Unlimited testimonials

  * Premium:  Unlimited testimonials and (color \+ logo) and hides Voizzy branding for the testimonial form.

* Dashboard stats: total testimonials, total pending, total approved

* Lightweight admin dashboard (view users and the number of their approved testimonials)

### **Phase 2: Premium Features**

* Customizable form (logo \+ colors, hide Voizzy branding)

* CAPTCHA for bot prevention

## **Limitations**

* Only one form per user

* No email notifications

* No AI features

* Only text \+ star rating testimonials

* Status flow: "pending" → approve/reject → status can be updated anytime


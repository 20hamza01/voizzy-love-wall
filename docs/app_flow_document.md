# **Voizzy App Flow (MVP)**

## **1\. Visitor Flow (Client Submitting Testimonial)**

* Visitor clicks a shareable link to a Voizzy-branded testimonial form (no need to authenticate to submit the testimonial)

  * Route: `/collect/:userId`

* Form contains:

  * Client Name (required)

  * Client Role (optional)

  * Star Rating (1–5, required)

  * Testimonial Content (required) no minimum characters but 1000 characters max

  * Submit button

* Upon submission:

  * Form is validated client-side

  * Testimonial is saved with status `pending`

  * Redirect to confirmation page (`/testimonial/success`)

  * Confirmation message shown with optional "Submit Another" button

## **2\. User Flow (Business Owner)**

### **Signup/Login**

* Email and password authentication using Supabase

### **Dashboard**

* Shows key stats:

  * Total Testimonials

  * Pending Testimonials

  * Approved Testimonials

* Displays list of testimonials with status:

  * Pending (action required)

  * Approved

  * Rejected

* Actions per testimonial:

  * Approve

  * Reject

  * Delete

  * Change status (switch between approve/reject)

### **Share Form**

* Users get a unique URL to their Voizzy-branded form

* Free and Basic users cannot customize the form

* Premium users can upload logo and select color (Voizzy branding hidden)

## **3\. Public Wall of Love iFrame Bubble Widget**

* Displays approved testimonials only

* Embed via simple iFrame code

* Displays:

  * Client Name (if provided)

  * Client Role (if provided)

  * Star Rating

  * Testimonial Text

## **4\. Plan Logic**

### **Free Plan**

* Max 3 testimonials (any status)

* Voizzy-branded form only

* No customization

### **Basic Plan ($19/month)**

* Unlimited testimonials

* Voizzy-branded form

* No customization

### **Premium Plan ($49/month)**

* Unlimited testimonials

* Customizable form (logo \+ color, hide Voizzy branding)

## **5\. Admin Flow**

* Lightweight dashboard to:

  * View all users

  * View total testimonials per user

  * See plan type

  * See last login/activity timestamp


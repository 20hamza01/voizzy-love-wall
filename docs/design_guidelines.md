# **Voizzy MVP Design Guidelines**

## **Overall Design Goals**

* Keep it minimal, clean, and user-friendly

* Use Voizzy branding colors and logo by default

* Prioritize usability and simplicity for MVP

## **General UI Components**

* **Typography**: Use system font stack (simple, fast-loading)

* **Colors**: Voizzy blue (\#3B82F6) as primary, with grayscale neutrals

* **Buttons**: Rounded, solid background with hover state

* **Inputs**: Minimal styling, clear labels, and required field indicators

* **Spacing**: Generous padding and margin to avoid clutter

## **Pages and Key Components**

### **Public Testimonial Form**

* Route: `/collect/:userId`

* Fields:

  * Client Name (required)

  * Client Role (optional)

  * Star Rating (1-5, required)

  * Testimonial Content (required) no minimum characters, 1000 characters max.

* Submit button: Prominent and disabled if validation fails

* Confirmation page: Simple thank you message with link to homepage

### **Dashboard**

* Summary Cards at the top:

  * Total Testimonials

  * Approved Testimonials

  * Pending Testimonials

* Table of Testimonials:

  * Columns: Name, Role, Rating, Content (truncated), Status (Pending/Approved/Rejected), Actions

  * Actions: Approve, Reject, Delete

  * Ability to switch status between approved and rejected

* Clear visibility for testimonial status

### **Wall of Love (Embed Bubble Widget)**

* iFrame-based bubble widget

* Displays only approved testimonials

* Testimonials shown with name, role, rating, and content

* Uses Voizzy branding colors by default

## **Responsive Design**

* Web-first layout

* Flexbox/Grid layout for dashboard and forms

* Forms and dashboard table adapt to screen size

## **Plan Limit Handling**

* Display non-intrusive banner in dashboard for free users nearing their limit

* Disable form submission once limit is reached (with message)

## **Branding Customization (Premium Plan)**

* Option to upload custom logo

* Choose from preset color themes (2–3 options)  
* Optional: Input a custom hex code for desired color  
* Hide Voizzy branding on form and widget

## **Accessibility**

* Ensure good color contrast

* Use semantic HTML elements

* Labels for all form fields

* Keyboard navigable inputs and buttons


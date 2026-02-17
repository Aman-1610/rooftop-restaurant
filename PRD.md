# Product Requirements Document (PRD) - The Rooftop Restaurant Website

| **Project Name** | The Rooftop Restaurant Website |
| :--- | :--- |
| **Version** | 1.0 |
| **Status** | Draft |
| **Date** | 2026-02-17 |
| **Author** | Antigravity (AI Assistant) |

---

## 1. Overview
**The Rooftop Restaurant** is a dining establishment located at Brahmaputra Complex, Satkar Chowk, Kahalgaon, Bihar, targeting families, couples, and local diners. The goal is to build a modern, responsive website that not only establishes a strong online brand presence but also facilitates core business operations like online food ordering and table reservations. The customized platform will streamline operations and attract more customers through a visually optimizing digital experience.

## 2. Objectives
*   **Increase Footfall & Revenue:** drive diners to the physical location and enable direct online sales.
*   **Operational Efficiency:** Automate reservation bookings and online order intake to reduce manual phone coordination.
*   **Brand Enhancement:** Showcase the unique rooftop ambiance through a premium, "evening vibe" design.
*   **Customer Convenience:** Provide easy access to menus, location, and ordering in both English and Hindi.
*   **Social Proof:** Leverage customer reviews and social media to build trust.

## 3. User Personas
*   **The Diner (Customer):** Tech-savvy or casual user looking to browse the menu, book a table for a special occasion, or order food for home delivery. Needs a fast, mobile-friendly interface.
*   **The Owner/Manager:** detailed-oriented individual needing to update menu prices, manage daily specials, and oversee reservations/orders without technical skills.
*   **The Staff:** Waitstaff or kitchen crew who need to view incoming orders and reservation lists in real-time.

## 4. Features & Functional Requirements

### 4.1. Customer-Facing Features
*   **Online Ordering System:**
    *   Full menu browsing with categories (Starters, Main Course, Drinks, etc.).
    *   "Add to Cart" functionality with customizable options (e.g., spice level).
    *   Checkout process with payment gateway integration (UPI, Credit/Debit).
    *   Real-time order tracking status (Received -> Preparing -> Out for Delivery).
*   **Table Reservation System:**
    *   Calendar widget for selecting date.
    *   Time slot selection based on operating hours.
    *   Party size selection.
    *   Instant confirmation via SMS/Email (optional integration).
*   **Digital Menu:**
    *   High-quality images for items.
    *   Dietary indicators (Veg/Non-Veg icons).
    *   Search and filter functionality.
*   **Photo Gallery & Social Feed:**
    *   Grid or carousel gallery of venue and food.
    *   Integration with Instagram/Facebook feed (optional).
*   **Reviews & Ratings:**
    *   Display curated 4-5 star reviews.
    *   Submission form for new reviews.
    *   Integration with Google Reviews API (if budget permits) or manual entry.
*   **Multilingual Support:**
    *   Language toggle (English / Hindi).
    *   Localized content for menu items and key navigation.
*   **Contact & Location:**
    *   Interactive **Google Maps** embed.
    *   **Click-to-Call** button for mobile users.
    *   Contact form for events/inquiries.
    *   Displayed Operating Hours.

### 4.2. Admin System (Dashboard)
*   **Authentication:** Secure login for Admin and Staff roles.
*   **Menu Management:**
    *   Add/Edit/Delete items.
    *   Update prices and "Out of Stock" status instantly.
    *   Upload/Change item images.
*   **Order Management:**
    *   Live dashboard showing incoming orders.
    *   Status updates (Accept, Reject, Mark as Ready/Delivered).
*   **Reservation Management:**
    *   List view of upcoming bookings.
    *   Ability to manually add bookings (for phone calls).
*   **Content Management:**
    *   Update Hero banner images.
    *   Manage Gallery photos.
    *   Moderate user-submitted reviews.
*   **Settings:**
    *   Update Restaurant Hours.
    *   Toggle Ordering/Reservations ON/OFF (e.g., for holidays).

## 5. Design Guidelines
*   **Theme:** "Rooftop Evening Ambiance"
    *   **Colors:** Dark mode dominant (deep blues, charcoal/blacks) with warm accents (gold, sunset orange, or neon aesthetic) to mimic city lights and sunset views.
    *   **Typography:** Modern sans-serif (e.g., Inter, Montserrat) for readability; elegant serif or display font for headings to convey adequate sophistication.
*   **Layout:**
    *   **Mobile-First:** optimized for touch controls; bottom navigation bar or hamburger menu.
    *   **Visual-Heavy:** Large hero images and food photography.
    *   **Smooth Animations:** Subtle fade-ins and transitions (using Framer Motion).

## 6. Tech Stack Recommendations
*   **Frontend:** **Next.js (React)** - Offers superior SEO, performance, and developer experience.
*   **Styling:** **Tailwind CSS** - Rapid styling with a mobile-first approach.
*   **Backend & Database:** **Supabase** - Provides a Postgres database, Authentication, and Real-time subscriptions (crucial for live order dashboard) with a generous free tier.
*   **Image Storage:** **Supabase Storage** or **Cloudinary** (free tier).
*   **Hosting:** **Vercel** - Seamless integration with Next.js, fast global CDN, and free for hobby/small commercial projects.
*   **Payments:** **Razorpay** or **PhonePe** Integration (Standard for Indian market).

*Why this stack?* It creates a high-performance, scalable app with near-zero monthly hosting costs for a small business.

## 7. Delivery Plan & Timeline

### Phase 1: MVP (Weeks 1-2)
*   **Core Setup:** Project init, Tailwind config, Database schema.
*   **Static Pages:** Home, About, Contact, Gallery.
*   **Menu Display:** Read-only digital menu (populated from DB).
*   **Admin Base:** Login and basic Menu editing.

### Phase 2: Interactivity (Weeks 3-4)
*   **Ordering System:** Cart logic, Checkout UI, Order submission.
*   **Reservations:** Booking form and database storage.
*   **Admin Dashboard:** Order receiving interface and Booking list.
*   **Multilingual Support:** Implementing Hindi translations.

### Phase 3: Polish & Launch (Week 5)
*   **Payment Integration:** Real payment gateway setup.
*   **Notifications:** Email/SMS confirmations (using SendGrid or similar).
*   **Testing:** Mobile responsiveness audit, User Acceptance Testing (UAT).
*   **Deployment:** Go live on Vercel.

## 8. Success Metrics
*   **Conversion Rate:** % of visitors who click "Order Now" or "Book a Table".
*   **Order Volume:** Number of daily online orders vs. phone orders.
*   **Load Time:** Page load speed under 2 seconds (Core Web Vitals).
*   **Customer Feedback:** Positive ratings on the ease of use of the website.

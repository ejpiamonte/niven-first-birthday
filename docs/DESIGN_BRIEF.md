# Design brief

**Status:** Documents the visual and interaction system in the current source; this is not a new approved redesign.

## Experience direction

The invitation uses a warm western-storybook look: dark coffee and cream surfaces, parchment-like cards, gold accents, a night-sky hero, decorative stars, envelope reveal, and subtle scroll animations. The tone is family-friendly and celebratory.

## Visual system

- **Palette:** coffee `#2B1810`, deep coffee `#1A0F09`, cream `#F7F0DF`, gold `#D4AF5A`, navy `#102A43`, brown `#8B5E3C`, sage `#87966B`, rust `#B4552F`.
- **Type:** Playfair Display for display/serif text; Inter for body copy. A local cursive fallback is used in select decorative styling.
- **Layout:** One vertically scrolling page with centered, constrained content, alternating dark and parchment-like sections, and a two-to-four-column responsive photo gallery.
- **Motion:** Envelope reveal, section scroll reveals, animated countdown, gallery transitions, and decorative motion. CSS includes a reduced-motion media query; verify third-party Framer Motion transitions against reduced-motion settings during UI review.

## Interaction and responsive behavior

- Mobile-first content widths; responsive Tailwind breakpoints expand gallery columns and button layouts on wider screens.
- Large touch targets are used for music, gallery, and dialog controls.
- The lightbox supports Escape and arrow keys and marks itself as a modal dialog. The map iframe has a descriptive title.
- Music starts only after a user gesture; a visible control toggles playback.
- Inputs have labels or placeholders; continue to ensure every form field has a programmatically associated label and visible focus state.

## Accessibility review notes

These are implementation review criteria, not a claim of WCAG conformance. Verify keyboard focus order, contrast, screen-reader announcement of RSVP errors/success, guestbook loading failures, modal focus containment/return, and reduced-motion behavior before claiming accessibility compliance. The guestbook form currently relies on placeholders rather than explicit labels, and its feedback messages are not marked as live regions.

## Asset conventions

“Little Moments” currently shows 16 decorative placeholders and does not load the gallery photos. The invitation uses `public/images/cartoon-hero.jpg` for the hero and `public/images/baby-closing3.jpg` for the closing portrait. `public/og-image.jpg` is the social preview image; the birthday track is `public/music/happy-birthday.wav`.

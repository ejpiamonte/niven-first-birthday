// Submits the RSVP silently to a Google Form so responses land in the
// Form's own Responses tab (totals, Yes/No pie chart, linked Sheet) without
// showing any Google UI to the guest. See SETUP.md for how to create the
// Form and find these values.
//
// Required env vars (all NEXT_PUBLIC_ since this runs in the browser —
// none of this is sensitive, a Form's response endpoint is public by design):
//   NEXT_PUBLIC_GFORM_ACTION_URL     e.g. https://docs.google.com/forms/d/e/FORM_ID/formResponse
//   NEXT_PUBLIC_GFORM_ENTRY_NAME     entry.XXXXXXXXX for the Name question
//   NEXT_PUBLIC_GFORM_ENTRY_ATTENDING entry.XXXXXXXXX for the Attending question
//   NEXT_PUBLIC_GFORM_ENTRY_GUESTS   entry.XXXXXXXXX for the Guest count question
//   NEXT_PUBLIC_GFORM_ENTRY_MESSAGE  entry.XXXXXXXXX for the Message question

const IFRAME_NAME = "gform-submit-target";

// These must match the multiple-choice option text you create in the
// Google Form exactly (see SETUP.md) — Google matches on the visible label.
export const ATTENDING_YES_LABEL = "Yes, I'll be there!";
export const ATTENDING_NO_LABEL = "Regretfully Decline";

function getHiddenIframe(): HTMLIFrameElement {
  let iframe = document.getElementsByName(IFRAME_NAME)[0] as
    | HTMLIFrameElement
    | undefined;

  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.name = IFRAME_NAME;
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  }

  return iframe;
}

export type RsvpFormValues = {
  name: string;
  attending: boolean;
  guestCount: number;
  message: string;
};

export function isGoogleFormConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_GFORM_ACTION_URL &&
      process.env.NEXT_PUBLIC_GFORM_ENTRY_NAME &&
      process.env.NEXT_PUBLIC_GFORM_ENTRY_ATTENDING
  );
}

/**
 * Fire-and-forget submit. Because the target is a hidden iframe pointed at
 * Google's cross-origin form endpoint, the browser never lets us read the
 * response — there is no reliable way to confirm success or failure from
 * here. We resolve once the form has been submitted, which is the standard,
 * widely-used pattern for posting to Google Forms without leaving the page.
 */
export function submitRsvpToGoogleForm(values: RsvpFormValues): Promise<void> {
  return new Promise((resolve, reject) => {
    const actionUrl = process.env.NEXT_PUBLIC_GFORM_ACTION_URL;
    const entryName = process.env.NEXT_PUBLIC_GFORM_ENTRY_NAME;
    const entryAttending = process.env.NEXT_PUBLIC_GFORM_ENTRY_ATTENDING;
    const entryGuests = process.env.NEXT_PUBLIC_GFORM_ENTRY_GUESTS;
    const entryMessage = process.env.NEXT_PUBLIC_GFORM_ENTRY_MESSAGE;

    if (!actionUrl || !entryName || !entryAttending) {
      reject(new Error("Google Form is not configured. See .env.example."));
      return;
    }

    const form = document.createElement("form");
    form.action = actionUrl;
    form.method = "POST";
    form.target = IFRAME_NAME;
    form.style.display = "none";

    function addField(entryId: string, value: string) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = entryId;
      input.value = value;
      form.appendChild(input);
    }

    addField(entryName, values.name);
    addField(
      entryAttending,
      values.attending ? ATTENDING_YES_LABEL : ATTENDING_NO_LABEL
    );

    if (entryGuests) {
      addField(entryGuests, values.attending ? String(values.guestCount) : "0");
    }

    if (entryMessage && values.message) {
      addField(entryMessage, values.message);
    }

    const iframe = getHiddenIframe();

    // Give the iframe a moment to be ready, then submit and resolve shortly
    // after — there is genuinely no load/error signal we can trust here
    // since the response is cross-origin.
    document.body.appendChild(form);
    form.submit();

    window.setTimeout(() => {
      form.remove();
      resolve();
    }, 600);

    // Referenced so linters don't flag it as unused; not otherwise needed.
    void iframe;
  });
}

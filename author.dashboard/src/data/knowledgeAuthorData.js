import createAuthorAccount from "@/assets/author/How-to-create-an-author-account.mp4";
import emailCampaign from "@/assets/author/How-to-Create-an-Email-Campaign.mp4";
import createTicket from "@/assets/author/How-to-request-support-and-create-a-ticket.mp4";
import addNewsletterSubscribers from "@/assets/author/How-to-add-newsletter-subscribers.mp4";
import uploadBook from "@/assets/author/How-to-upload-a-book.mp4";

export const authorKnowledgeVideos = [
  {
    id: "create-author-account",
    title: "How to Create an Author Account",
    script: `Hello!

I’ll guide you on how to create an Author account. Start by clicking Sign up. Enter your full name, email address and Password and click Get Started. An otp would be sent to your email address. Enter the otp  in the displayed field and click submit. 

A success message is displayed and you'll be redirected to the sign in page. Sign in using your email and password. A success message is displayed and you'll be redirected to a page to upload your profile image. Select an image from your device and click Next. Enter details about yourself and enter your social handles in the displayed field. Click Next and you’ll be taken to the address details form. 

Click on the expand icon and select your country from the displayed list. Enter your address in the displayed field. Enter your city, state, zip code and phone number. Click Next. The account details form will be displayed. 

Click on the expand icon and select your bank from the displayed list. Enter your account number in the displayed field and the name field would be automatically filled with the account name associated with the entered account number. Click on Submit. 
A success message will be displayed and the user will be taken to the membership and tiers page. 

Select a membership and click Get Started. Complete the payment process and click subscribe. A success message will be displayed and the author will be successfully logged into the application.
`,
    src: createAuthorAccount,
  },
  {
    id: "upload-book",
    title: "How to Upload a Book",
    script: `Hello!

I’ll guide you on how to upload a book. To upload a book, log in and navigate to My Publications and click the expand icon. Select Upload Book. A form will be displayed for you to enter the e-Book details.

Enter the title of the book and an optional sub-title. Click on the expand icon and select a genre from the displayed list. Enter the tags in the displayed field.

The author name field is not editable as the name displayed here is what was entered during account creation.

Enter the book description and language in the respective fields. Click on the first upload icon to upload the cover image and click on the second upload icon to upload the e-Book. After all the fields have been filled, click on Save and Continue.

On the publishing rights form, select the copyright ownership and license type from the respective fields by clicking the dropdown. To prevent unauthorized sharing, check the box below to enable DRM protection. Click Save and Continue.

On the Pricing form, select the currency and enter the price of the book. If you want to apply a discount, enter the discount and select the duration of the discount. Click Save and Continue.

The preview of the book will be displayed. To view the e-book before submission, click on View Book. After confirming all the details, click on Submit for Review. A success message will be displayed and the book will be sent for review.
The book will be displayed in your All Books with a pending status and after approval, the status will change from Pending to Approved.`,
    src: uploadBook,
  },
  {
    id: "create-ticket",
    title: "How to Request Support and Create a Ticket",
    script: `Hello!

I’ll guide you on how to request support and create a ticket. To create a support ticket, log in and navigate to the Support page from the sidebar.Click on the “Create Ticket” button. A form will be displayed for you to describe your issue.

Enter the subject of your support request. In the description field, explain the problem or assistance you need. If you have a screenshot or file that supports your request, click the upload icon to attach it.

Next, select a category that best fits the nature of your ticket, such as Technical Issue, Billing, or General Inquiry.

After filling out all required fields, click on the “Submit Ticket” button. A success message will be displayed, and your ticket will appear in the list of open requests.

Support will reach out to you shortly via your registered email or in-app notifications.`,
    src: createTicket,
  },
  {
    id: "create-email-campaign",
    title: "How to Create an Email Campaign",
    script: `Hello!

    I’ll guide you on how to create an email campaign. To create an email campaign, log in and navigate to the Promotions page. 

    Click on the Email Campaign tab and select the type of campaign you would like to create. We'll be creating a book announcement campaign. Enter the subject title and click on the upload icon to upload the book cover.

    Enter the book description and link to purchase in the respective fields. After filling in all the details. Click save. A success message will be displayed and Your email campaign will be displayed in your drafts

    Navigate to your drafts, identify the newly created email campaign, and click send. Confirm your actions by clicking Yes. A success message is displayed and your email campaign will be sent successfully. 
`,
    src: emailCampaign,
  },
  {
    id: "add-newsletter-subscribers",
    title: "How to add newsletter subscribers to your list",
    script: `Hello!

    I’ll guide you on how to add newsletter subscribers to your list. To add email subscribers, log in and navigate to the Promotions page. Click on the Imported Subscribers tab and click on the Add Subscriber button

    Enter the first name, last name, and email address in the displayed field. And Click Add Subscriber.A success message will be displayed, and the subscriber will be successfully added to your list. 

    To add multiple subscribers, click the import subscribers button. Upload a csv file populated with your subscribers and click import file. A success message is displayed, and your subscribers will be successfully imported and displayed on the list.
`,
    src: addNewsletterSubscribers,
  },
];

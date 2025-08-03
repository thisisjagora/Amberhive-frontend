import acceptOrRejectBook from "@/assets/admin/How-to-Accept-or-Reject-a-book.mp4";
import addNewGenre from "@/assets/admin/How-to-add-a-new-genre.mp4";



export const knowledgeVideos = [
  {
    id: "approve-reject-book",
    title: "How to Approve and Reject a Book",
    script: `Hello!

I’ll guide you on how to approve and reject a book. Navigate to the content management section and click on Pending Approval.

A list of submitted books awaiting review will be displayed here. To approve a book, click on the three-dotted icon and select view details. 

All the details of the book will be displayed. To read the book, click on the read book button, and the book will be opened for the admin to read through.

Click on Approve and confirm the approval. A success message will be displayed, and the approved book will be displayed under the approved books tab.

Similarly, to reject a book, click on the three-dotted icon and select view details. All the details of the book will be displayed. 

To read the book, click on the read book button, and the book will be opened for the admin to read through.

Enter the reason for rejection in the displayed field, click on Reject and confirm the rejection. 

A success message will be displayed, and the rejected book will be displayed under the rejected books tab.`,
    src: acceptOrRejectBook,
  },
  {
    id: "add-genre",
    title: "How to Add a New Genre",
    script: `Hello!

I’ll guide you on how to add a new genre. To add a new genre, navigate to the content management section and click on Genre.

A list of existing Genre will be displayed here. Click on the Create Genre button.

Enter the genre and description in the displayed field and click Submit. A success message will be displayed and the newly added genre will be displayed on the list.`,
    src: addNewGenre,
  },
];

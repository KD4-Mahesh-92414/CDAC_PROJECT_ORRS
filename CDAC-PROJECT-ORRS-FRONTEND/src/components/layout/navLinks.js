import { Users, Barcode, Train, XCircle, Question, CreditCard, Signpost, ChatCircle, Megaphone, User, PencilSimple, LockKey, ClockCounterClockwise, Wallet, UserList } from 'phosphor-react';

export const trainItems = [
  { label: "Group Booking", path: "/trains/group-booking", icon: Users },
  { label: "PNR Status", path: "/trains/pnr-status", icon: Barcode },
  { label: "Live Train Status", path: "/trains/live-status", icon: Train },
  { label: "Cancelled Trains", path: "/trains/cancelled", icon: XCircle },
];

export const helpItems = [
  { label: "How to Book", path: "/help/how-to-book", icon: Question },
  { label: "Cancellation & Refund", path: "/help/cancellation-refund", icon: CreditCard },
  { label: "Travel Guidelines", path: "/help/travel-guidelines", icon: Signpost },
  { label: "FAQs", path: "/help/faqs", icon: Question },
];

export const contactItems = [
  { label: "Customer Support", path: "/contact/support", icon: ChatCircle },
  { label: "Feedback", path: "/contact/feedback", icon: Megaphone },
];

export const accountItems = [
  { label: "My Profile", path: "/account/profile", icon: User },
  { label: "Edit Profile", path: "/account/edit-profile", icon: PencilSimple },
  { label: "Change Password", path: "/account/change-password", icon: LockKey },
  { label: "Booking History", path: "/account/bookings", icon: ClockCounterClockwise },
  { label: "Payment History", path: "/account/payments", icon: Wallet },
  { label: "Saved Passengers", path: "/account/saved-passengers", icon: UserList },
];

// src/app/feedback/page.tsx
import { Metadata } from 'next';
import FeedbackClient from './FeedbackClient';

export const metadata: Metadata = {
  title: "Submit Feedback",
  description: "Share your experience with AllSetTools! Review our online developer utilities, suggest new tool request integrations, or submit feedback to help improve the platform.",
  keywords: [
    "allsettools feedback",
    "rate online tools",
    "suggest new web tool",
    "developer utilities reviews",
    "submit platform rating"
  ],
  alternates: {
    canonical: "https://allsettools.com/feedback",
  },
  openGraph: {
    title: "Submit Feedback",
    description: "Share your experience with AllSetTools! Review our online developer utilities, suggest new tool request integrations, or submit feedback to help improve the platform.",
    url: "https://allsettools.com/feedback",
    siteName: "AllSetTools",
    type: "website",
  }
};

export default function Feedback() {
  return <FeedbackClient />;
}

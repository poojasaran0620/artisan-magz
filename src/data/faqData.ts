export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'What shipping options are available?',
    answer:
      'We offer two delivery options: Normal Delivery (FREE), which takes 8–12 working days, and Express Delivery (₹150), which takes 5–7 working days.',
  },
  {
    question: 'Are my photos and personal details safe?',
    answer:
      'Yes, your photos are completely safe with us. We never post or share anything without your explicit permission.',
  },
  {
    question: 'Are there any additional delivery charges?',
    answer:
      'Normal delivery is FREE. However, delivery charges apply separately for Frames and Hampers (₹100).',
  },
  {
    question: 'Can I customize my magazine?',
    answer:
      'Absolutely! Every magazine is specially created for you and can be personalized with your photos, names, dates, messages and more.',
  },
  {
    question: 'What is your refund/return policy?',
    answer:
      'Since every order is custom-made, we do not offer refunds or returns. In case your product arrives damaged, please contact us with a continuous, unedited unboxing video showing the package from the beginning.',
  },
];

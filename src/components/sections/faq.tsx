import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is this a guaranteed income?",
    answer: "This is not a job or an offer of employment. We provide training, resources, and contacts to empower you to start your own letter-writing service. Your income depends on your own effort and the number of clients you engage.",
  },
  {
    question: "What supplies do I need?",
    answer: "You will need high-quality stationery, pens, and envelopes. We provide recommendations in our resource kit, but the cost of supplies is your responsibility.",
  },
  {
    question: "How do I get paid?",
    answer: "You will be working as an independent contractor. Clients pay you directly through various methods like PayPal, Venmo, or direct bank transfer. We provide guidance on setting this up.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-secondary/50 px-6 rounded-2xl border-b-0">
              <AccordionTrigger className="text-left hover:no-underline text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

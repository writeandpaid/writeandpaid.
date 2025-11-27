'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const mainCourses = [
    {
        id: "paid-for-letters",
        title: "Get paid to hand-write letters for select large companies—right from home.",
        description: "The system is simple: follow the lessons, hand-copy provided content onto paper, and mail it in. Expect your first payout in ~12-14 weeks (up to $5 per letter) as mail gets processed, then payouts can become weekly as you continue. U.S. poly certain stores excluded.",
        features: [
            "Beginner-friendly: no experience required",
            "Clear checklist from sign-up to first payout",
            "Flexible, at-home schedule that fits your life"
        ],
        tag: "#1 Course: Paid For Letter"
    },
    {
        id: "digital-marketing",
        title: "Master digital marketing and earn like a pro.",
        description: "Plug into a ready-to-use system with pre-built funnels, commission-ready offers, automated emails, step-by-step training, and live support—so you can launch without tech headaches.",
        features: [
            "High-performance, done-for-you funnel assets",
            "Integrated offers + automated email sequences",
            "Live coaching, community, and ongoing support",
            "Practical training across social, content, email, PPC, solo ads, and more"
        ],
        tag: "#2 Course: Marketing Pros (Bimpres)"
    }
]

export function MainCourses() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {mainCourses.map((course) => (
                        <Card key={course.id} className="border-2 border-gray-200 shadow-lg rounded-2xl p-8">
                            <div className="text-sm font-bold text-primary bg-green-100 inline-block px-3 py-1 rounded-full mb-4">{course.tag}</div>
                            <CardHeader className="p-0">
                                <CardTitle className="text-2xl font-bold">{course.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 mt-4">
                                <p className="text-gray-600 mb-6">{course.description}</p>
                                <ul className="space-y-3">
                                    {course.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

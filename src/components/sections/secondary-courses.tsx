'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const secondaryCourses = [
    {
        id: "ai-twin",
        title: "Create your on-brand \"AI Twin.\"",
        description: "Design a digital version of yourself—face, animation, and voice—so your presence can work for you even when you're offline. Perfect for tutorials, sales pages, FAQs, and onboarding.",
        tag: "AI Twin"
    },
    {
        id: "credit-repair",
        title: "DIY credit repair, step by step.",
        description: "Analyze reports, challenge inaccurate items using consumer protection laws, and track progress with pre-written dispute letters and simple checklists.",
        tag: "Send It Credit"
    }
]

export function SecondaryCourses() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {secondaryCourses.map((course) => (
                        <Card key={course.id} className="bg-white shadow-lg rounded-2xl p-8 border-2 border-gray-200">
                             <div className="text-sm font-bold text-primary bg-green-100 inline-block px-3 py-1 rounded-full mb-4">{course.tag}</div>
                            <CardHeader className="p-0">
                                <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 mt-4">
                                <p className="text-gray-600">{course.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

'use client';

export function BonusSection() {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-4 border-primary rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-green-50">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary text-white font-bold px-4 py-2 rounded-lg">BONUS:</div>
                        <h3 className="text-xl font-bold text-gray-900">Get <span className="text-primary">ALL</span> Courses</h3>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-gray-600">More now—when spots fill, access to this bonus ends.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <p className="font-bold text-lg">People enrolled in bonus: 1,172</p>
                        </div>
                        <div className="bg-gray-900 text-white font-bold px-4 py-2 rounded-lg">
                           Spots remaining: 128
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

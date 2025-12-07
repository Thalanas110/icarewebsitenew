import { Layout } from '@/components/layout/Layout';
import { useGallery } from '@/hooks/useChurchData';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Image as ImageIcon } from 'lucide-react';

const Gallery = () => {
    const { data: images, isLoading } = useGallery();

    return (
        <Layout>
            <section className="bg-church-navy py-20 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-fade-in">
                        <span className="text-black">Photo</span> <span className="text-church-orange">Gallery</span>
                    </h1>
                    <p className="text-xl text-black max-w-2xl mx-auto">
                        Glimpses of our life together in worship and community
                    </p>
                </div>
            </section>

            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-12 h-12 text-church-orange animate-spin" />
                        </div>
                    ) : images && images.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {images.map((image) => (
                                <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <div className="relative aspect-video group">
                                        <img
                                            src={image.image_url}
                                            alt={image.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                            <h3 className="text-white font-display font-bold text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                {image.title}
                                            </h3>
                                            {image.description && (
                                                <p className="text-white/80 text-sm mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                                    {image.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-church-cream mb-6">
                                <ImageIcon className="w-10 h-10 text-church-navy/50" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                                Gallery Coming Soon
                            </h3>
                            <p className="text-muted-foreground">
                                We haven't uploaded any photos yet. Check back later!
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default Gallery;

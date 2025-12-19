import { Layout } from '@/components/layout/Layout';
import { useGallery } from '@/hooks/useChurchData';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { Marquee } from '@/components/ui/marquee';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

const Gallery = () => {
    const { data: images, isLoading } = useGallery();

    const firstRow = images ? images.slice(0, Math.ceil(images.length / 2)) : [];
    const secondRow = images ? images.slice(Math.ceil(images.length / 2)) : [];

    return (
        <Layout>
            <section id="hero" className="bg-white py-20 text-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-fade-in">
                        <span className="text-black">Photo</span> <span className="text-church-orange">Gallery</span>
                    </h1>
                    <p className="text-xl text-black max-w-2xl mx-auto">
                        Glimpses of our life together in worship and community
                    </p>
                </div>
            </section>

            <section id="gallery-grid" className="py-20 bg-background overflow-hidden">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-12 h-12 text-church-orange animate-spin" />
                        </div>
                    ) : images && images.length > 0 ? (
                        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                            <Marquee pauseOnHover className="[--duration:20s]">
                                {firstRow.map((image) => (
                                    <GalleryCard key={image.id} image={image} />
                                ))}
                            </Marquee>
                            <Marquee reverse pauseOnHover className="[--duration:20s]">
                                {secondRow.map((image) => (
                                    <GalleryCard key={image.id} image={image} />
                                ))}
                            </Marquee>
                            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
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

const GalleryCard = ({ image }: { image: any }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="w-96 overflow-hidden mx-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="relative aspect-video group/card">
                        <img
                            src={image.image_url}
                            alt={image.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <h3 className="text-white font-display font-bold text-xl translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                                {image.title}
                            </h3>
                            {image.description && (
                                <p className="text-white/80 text-sm mt-2 translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-75">
                                    {image.description}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        src={image.image_url}
                        alt={image.title}
                        className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
                    />
                    {image.description && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 text-white backdrop-blur-sm rounded-b-lg">
                            <h3 className="font-bold text-lg">{image.title}</h3>
                            <p className="text-sm text-white/90">{image.description}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Gallery;

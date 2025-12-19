import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSermons } from '@/hooks/useChurchData';
import { Calendar, Clock, BookOpen, Video, Music, Play } from 'lucide-react';
import { format } from 'date-fns';

const Sermons = () => {
  const { data: sermons, isLoading } = useSermons();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading sermons...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section id="hero" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            <span className="text-foreground">Sermons & </span>
            <span className="text-church-orange">Messages</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Listen to God's Word as we dive deep into Scripture and discover how it applies to our daily lives
          </p>
        </div>
      </section>

      {/* Facebook Livestream Section */}
      <section id="livestream" className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-3">
                <span className="text-foreground">Watch </span>
                <span className="text-church-orange">Live</span>
              </h2>
              <p className="text-muted-foreground">
                Join us live on Facebook for our services and special events
              </p>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="w-full aspect-video bg-black">
                  <iframe
                    src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F100064902870970%2Flive&show_text=false&t=0"
                    width="100%"
                    height="100%"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Can't see the embed? <a href="https://www.facebook.com/icarefellowship" target="_blank" rel="noopener noreferrer" className="text-church-orange hover:underline">Visit our Facebook page</a>
            </p>
          </div>
        </div>
      </section>

      {/* Sermons Section */}
      <section id="sermons-list" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {sermons && sermons.length > 0 ? (
            <div className="grid gap-8 max-w-4xl mx-auto">
              {sermons.map((sermon) => (
                <Card key={sermon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    {/* Thumbnail */}
                    <div className="md:w-1/3">
                      {sermon.thumbnail_url ? (
                        <div className="relative h-48 md:h-full">
                          <img
                            src={sermon.thumbnail_url}
                            alt={sermon.title}
                            className="w-full h-full object-cover"
                          />
                          {sermon.video_url && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
                                <Play className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-48 md:h-full bg-gradient-to-br from-church-navy to-church-teal flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-church-gold">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {format(new Date(sermon.sermon_date), 'MMMM d, yyyy')}
                          </span>
                        </div>
                        {sermon.is_featured && (
                          <Badge variant="default" className="bg-church-gold text-church-navy">
                            Featured
                          </Badge>
                        )}
                      </div>

                      <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">
                        {sermon.title}
                      </h2>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{sermon.speaker}</span>
                        </div>
                        {sermon.duration_minutes && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{sermon.duration_minutes} min</span>
                          </div>
                        )}
                        {sermon.scripture_reference && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{sermon.scripture_reference}</span>
                          </div>
                        )}
                      </div>

                      {sermon.series_name && (
                        <Badge variant="outline" className="mb-3">
                          {sermon.series_name}
                        </Badge>
                      )}

                      {sermon.description && (
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {sermon.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3">
                        {sermon.video_url && (
                          <Button asChild className="bg-church-gold hover:bg-church-gold/90 text-black">
                            <a href={sermon.video_url} target="_blank" rel="noopener noreferrer">
                              <Video className="w-4 h-4 mr-2" />
                              Watch Video
                            </a>
                          </Button>
                        )}
                        {sermon.audio_url && (
                          <Button asChild variant="outline">
                            <a href={sermon.audio_url} target="_blank" rel="noopener noreferrer">
                              <Music className="w-4 h-4 mr-2" />
                              Listen Audio
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-2xl font-display font-bold mb-4">No Sermons Available</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're working on adding sermon content. Please check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Sermons;
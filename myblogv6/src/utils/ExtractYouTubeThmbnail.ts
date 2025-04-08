export default function extractYouTubeThumbnail(url: string): string | null {
    try {
      const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.*|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/);
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
      }
      return null;
    } catch (error) {
      console.error("Error extracting YouTube thumbnail:", error);
      return null;
    }
  }
  
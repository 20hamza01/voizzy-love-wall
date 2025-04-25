
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";

interface EmbedWidgetProps {
  userId: string;
  embedCode: string;
}

export function EmbedWidget({ userId, embedCode }: EmbedWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          <span>Testimonial Widget</span>
        </CardTitle>
        <CardDescription>Embed the widget on your website</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Collection Form Link</h4>
            <div className="flex gap-2">
              <Input 
                readOnly 
                value={`${window.location.origin}/collect/${userId}`}
                className="flex-1 text-sm bg-muted"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/collect/${userId}`);
                  toast.success("Link copied to clipboard");
                }}
              >
                Copy
              </Button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Embed Widget</h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" size="sm">
                  Get Embed Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Embed Voizzy Widget</DialogTitle>
                  <DialogDescription>
                    Copy and paste this code into your website to display your testimonials.
                  </DialogDescription>
                </DialogHeader>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-auto whitespace-pre-wrap">{embedCode}</pre>
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(embedCode);
                    toast.success("Embed code copied to clipboard");
                  }}
                >
                  Copy Code
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

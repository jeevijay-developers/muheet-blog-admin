import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ArrowLeft } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { BlogFormData } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';

interface BlogFormProps {
  initialData?: BlogFormData;
  onSubmit: (data: BlogFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const BlogForm = ({ initialData, onSubmit, onCancel, isEditing = false }: BlogFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    isVisible: true,
    ...initialData
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save delay
      onSubmit(formData);
      
      toast({
        title: isEditing ? "Blog Updated" : "Blog Created",
        description: isEditing 
          ? "Your blog post has been successfully updated." 
          : "Your new blog post has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onCancel} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">
              {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update your blog post content' : 'Write and publish your new blog post'}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Publish Post')}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
                <CardDescription>
                  Create engaging content for your blog post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter blog post title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-lg font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief description of your blog post..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content *</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
                <CardDescription>
                  Control the visibility and status of your post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="visibility">Visible to Public</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this post visible on your blog
                    </p>
                  </div>
                  <Switch
                    id="visibility"
                    checked={formData.isVisible}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, isVisible: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Author Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">MB</span>
                  </div>
                  <div>
                    <p className="font-medium">Muheet Bharti</p>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
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
    banner: '',
    images: [],
    subtitle: '',
    body: '',
    tags: [],
    visibility: 'draft',
    ...initialData
  });
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleFileUpload = async (file: File): Promise<string> => {
    // For now, create a blob URL for local preview
    // In production, you would upload to a cloud service like Cloudinary, AWS S3, etc.
    return URL.createObjectURL(file);
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await handleFileUpload(file);
        setFormData({ ...formData, banner: imageUrl });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await handleFileUpload(file);
        setFormData({
          ...formData,
          images: [...(formData.images || []), imageUrl]
        });
        // Reset the input
        e.target.value = '';
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.body.trim() || !formData.banner) {
      toast({
        title: "Validation Error",
        description: "Title, banner image, and content are required fields.",
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            size="sm" 
            className="border-dashed hover:border-solid shadow-sm transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
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
          className="bg-gradient-primary hover:opacity-90 shadow-md hover:shadow-lg transition-shadow"
          size="lg"
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
                  <Label htmlFor="title" className="text-base font-medium">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter an engaging blog post title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-lg font-medium py-6 shadow-sm placeholder:text-muted-foreground/50"
                    required
                  />
                  {formData.title && (
                    <p className="text-xs text-muted-foreground text-right">
                      {formData.title.length} characters
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="banner" className="text-base font-medium flex items-center">
                    Banner Image * 
                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                      (This will appear at the top of your blog post)
                    </span>
                  </Label>
                  <div className="space-y-3">
                    {formData.banner ? (
                      <div className="relative group rounded-lg overflow-hidden border shadow-sm transition-all hover:shadow-md">
                        <img 
                          src={formData.banner} 
                          alt="Banner preview" 
                          className="w-full h-56 object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setFormData({ ...formData, banner: '' })}
                            className="shadow-md"
                          >
                            Remove Banner
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30 text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Drop your banner image here or click to browse</p>
                      </div>
                    )}
                    <Input
                      id="banner"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer border border-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle" className="text-base font-medium flex items-center">
                    Subtitle
                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                      (A brief summary that appears below the title)
                    </span>
                  </Label>
                  <Textarea
                    id="subtitle"
                    placeholder="Write a compelling description that summarizes your blog post..."
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    rows={3}
                    className="resize-none shadow-sm placeholder:text-muted-foreground/50"
                  />
                  {formData.subtitle && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <p>{formData.subtitle.split(' ').length} words</p>
                      <p>{formData.subtitle.length} characters</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Content *</Label>
                  <RichTextEditor
                    content={formData.body}
                    onChange={(content) => setFormData({ ...formData, body: content })}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center">
                    Additional Images
                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                      (Images to use inside your blog post)
                    </span>
                  </Label>
                  
                  {formData.images?.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                      {formData.images?.map((img, index) => (
                        <div 
                          key={index} 
                          className="relative group overflow-hidden rounded-md border shadow-sm hover:shadow-md transition-all"
                        >
                          <img 
                            src={img} 
                            alt={`Additional image ${index + 1}`} 
                            className="w-full h-28 object-cover transition-transform group-hover:scale-105 duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm"
                              onClick={() => setFormData({
                                ...formData,
                                images: formData.images?.filter((_, i) => i !== index)
                              })}
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
                            Image {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-md p-4 text-center bg-muted/30 mb-3">
                      <p className="text-sm text-muted-foreground">No additional images uploaded yet</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAdditionalImageUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/90 cursor-pointer border border-input flex-1"
                    />
                    <p className="text-sm text-muted-foreground hidden sm:block">
                      {formData.images?.length || 0} images added
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-md border-t-4 border-t-primary overflow-hidden">
              <CardHeader className="bg-card pb-3">
                <CardTitle>Publish Settings</CardTitle>
                <CardDescription>
                  Control the visibility and status of your post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="p-4 rounded-lg border border-dashed bg-muted/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="visibility" className="text-base font-medium">Publishing Status</Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.visibility === 'public' ? 'Visible to everyone' : 'Only visible to you'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Switch
                      id="visibility"
                      checked={formData.visibility === 'public'}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, visibility: checked ? 'public' : 'draft' })
                      }
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {formData.visibility === 'public' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tags" className="text-base font-medium">Tags</Label>
                  
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
                    {formData.tags.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No tags added yet</p>
                    ) : (
                      formData.tags.map(tag => (
                        <div 
                          key={tag} 
                          className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full shadow-sm hover:shadow-md transition-shadow group"
                        >
                          <span className="text-xs font-medium">#{tag}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-4 w-4 p-0 rounded-full opacity-50 group-hover:opacity-100"
                            onClick={() => removeTag(tag)}
                          >
                            ×
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex items-center gap-2 relative">
                    <Input
                      placeholder="Enter tag and press Enter..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="pr-[70px]"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addTag}
                      className="absolute right-1 top-1 bottom-1 min-w-[60px]"
                    >
                      Add
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    Tags help readers find your content
                  </p>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2">Publishing Checklist</h4>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.title ? 'bg-success text-success-foreground' : 'bg-muted-foreground/30'}`}>
                        {formData.title && '✓'}
                      </div>
                      <span>Title added</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.banner ? 'bg-success text-success-foreground' : 'bg-muted-foreground/30'}`}>
                        {formData.banner && '✓'}
                      </div>
                      <span>Banner image added</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.body ? 'bg-success text-success-foreground' : 'bg-muted-foreground/30'}`}>
                        {formData.body && '✓'}
                      </div>
                      <span>Content added</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.tags.length > 0 ? 'bg-success text-success-foreground' : 'bg-muted-foreground/30'}`}>
                        {formData.tags.length > 0 && '✓'}
                      </div>
                      <span>Tags added ({formData.tags.length})</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-t-4 border-t-accent overflow-hidden">
              <CardHeader className="bg-card pb-3">
                <CardTitle>Author Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-md ring-2 ring-background">
                    <span className="text-white text-lg font-medium">MB</span>
                  </div>
                  <div>
                    <p className="font-medium">Muheet Bharti</p>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm">
                    <span className="font-medium">Status: </span>
                    <span className={`${formData._id ? 'text-amber-500' : 'text-blue-500'} font-medium`}>
                      {formData._id ? 'Editing Existing Blog' : 'Creating New Blog'}
                    </span>
                  </p>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Last Updated: </span>
                    <span className="text-muted-foreground">
                      {formData.updatedAt 
                        ? new Date(formData.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Not published yet'
                      }
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Form Actions */}
            <Card className="shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="text-sm">
                    <p className="font-medium">Ready to publish?</p>
                    <p className="text-muted-foreground mt-1">
                      {formData.visibility === 'public' 
                        ? 'Your blog will be visible to the public' 
                        : 'Save as draft to publish later'
                      }
                    </p>
                  </div>
                  
                  <div className="flex gap-3 ml-auto">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onCancel}
                      className="gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 14L4 9l5-5" />
                        <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
                      </svg>
                      Cancel
                    </Button>
                    
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="min-w-[120px] gap-2 shadow-md"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                          </svg>
                          {formData._id ? 'Update Blog' : 'Save Blog'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Form Footer - Mobile View Actions */}
        <div className="lg:hidden border-t pt-6 pb-2">
          <div className="flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? 'Saving...' : (formData._id ? 'Update' : 'Save')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
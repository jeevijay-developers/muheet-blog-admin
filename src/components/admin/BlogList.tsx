import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Plus,
  Filter,
  Calendar
} from 'lucide-react';
import { Blog } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';

interface BlogListProps {
  blogs: Blog[];
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isVisible: boolean) => void;
  onCreateNew: () => void;
}

const BlogList = ({ blogs, onEdit, onDelete, onToggleVisibility, onCreateNew }: BlogListProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden'>('all');

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (blog.subtitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'visible' && blog.visibility === 'public') ||
                         (filter === 'hidden' && blog.visibility !== 'public');

    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string, title: string) => {
    onDelete(id);
    toast({
      title: "Blog Deleted",
      description: `"${title}" has been deleted successfully.`,
    });
  };

  const handleToggleVisibility = (id: string, currentVisibility: boolean, title: string) => {
    onToggleVisibility(id, currentVisibility);
    toast({
      title: currentVisibility ? "Blog Published" : "Blog Hidden",
      description: `"${title}" is now ${currentVisibility ? 'visible to the public' : 'hidden from the public'}.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Blog Management</h1>
          <p className="text-muted-foreground">
            Manage all your blog posts, edit content, and control visibility
          </p>
        </div>
        <Button onClick={onCreateNew} className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Create New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-semibold">{blogs.length}</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-semibold text-success">
                  {blogs.filter(blog => blog.visibility === 'public').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-semibold text-muted-foreground">
                  {blogs.filter(blog => blog.visibility !== 'public').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts by title or excerpt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1.5 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Posts</option>
                <option value="visible">Published</option>
                <option value="hidden">Drafts</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {searchTerm || filter !== 'all' ? 'No posts match your search criteria.' : 'No blog posts yet.'}
              </p>
              <Button onClick={onCreateNew} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        {blog.banner && (
                          <img 
                            src={blog.banner.url} 
                            alt={blog.title}
                            className="h-10 w-16 object-cover rounded" 
                          />
                        )}
                        <div>
                          <p className="font-medium">{blog.title}</p>
                          {blog.subtitle && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {blog.subtitle}
                            </p>
                          )}
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {blog.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={blog.visibility === 'public' ? "default" : "secondary"}
                          className={blog.visibility === 'public' ? "bg-success hover:bg-success/90" : ""}
                        >
                          {blog.visibility === 'public' ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Draft
                            </>
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(blog.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(blog.updatedAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Switch
                          checked={blog.visibility === 'public'}
                          onCheckedChange={(checked) => 
                            handleToggleVisibility(blog._id, checked, blog.title)
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(blog)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(blog._id, blog.title)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogList;
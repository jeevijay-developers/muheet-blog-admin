import { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import BlogList from '@/components/admin/BlogList';
import BlogForm from '@/components/admin/BlogForm';
import { Blog, BlogFormData } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllBlogs, 
  createBlog, 
  updateBlog, 
  deleteBlog,
  publishBlog,
  unpublishBlog
} from '@/server/server';

type AdminTab = 'dashboard' | 'blogs' | 'create' | 'edit' | 'settings';

const Admin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load blogs on mount and when authenticated
  useEffect(() => {
    const fetchBlogs = async () => {
      if (isAuthenticated) {
        try {
          const response = await getAllBlogs();
          if (response.success && Array.isArray(response.data)) {
            setBlogs(response.data);
          }
        } catch (error) {
          console.error('Error fetching blogs:', error);
          toast({
            title: "Error",
            description: "Failed to load blogs. Please try again.",
            variant: "destructive"
          });
        }
      }
    };
    
    fetchBlogs();
  }, [isAuthenticated, toast]);

  const handleLogin = () => {
    localStorage.setItem('admin_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    setEditingBlog(null);
  };

  const handleCreateBlog = async (data: BlogFormData) => {
    try {
      const response = await createBlog(data);
      if (response.success) {
        // Refresh blogs list
        const blogsResponse = await getAllBlogs();
        if (blogsResponse.success) {
          setBlogs(blogsResponse.data);
        }
        setActiveTab('blogs');
        
        toast({
          title: "Blog Created",
          description: "Your new blog post has been created successfully.",
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateBlog = async (data: BlogFormData) => {
    if (!editingBlog) return;
    
    try {
      const response = await updateBlog(editingBlog._id, data);
      if (response.success) {
        // Refresh blogs list
        const blogsResponse = await getAllBlogs();
        if (blogsResponse.success) {
          setBlogs(blogsResponse.data);
        }
        setEditingBlog(null);
        setActiveTab('blogs');
        toast({
          title: "Blog Updated",
          description: "Your blog post has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast({
        title: "Error",
        description: "Failed to update blog post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const response = await deleteBlog(id);
      if (response.success) {
        // Refresh blogs list
        const blogsResponse = await getAllBlogs();
        if (blogsResponse.success) {
          setBlogs(blogsResponse.data);
        }
        
        toast({
          title: "Blog Deleted",
          description: "Your blog post has been successfully deleted.",
        });
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleBlogVisibility = async (id: string, isPublic: boolean) => {
    try {
      const response = isPublic 
        ? await unpublishBlog(id)
        : await publishBlog(id);
        
      if (response.success) {
        // Refresh blogs list
        const blogsResponse = await getAllBlogs();
        if (blogsResponse.success) {
          setBlogs(blogsResponse.data);
        }
        
        toast({
          title: isPublic ? "Blog Unpublished" : "Blog Published",
          description: `Your blog post is now ${isPublic ? "unpublished" : "published"}.`,
        });
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update blog visibility. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setActiveTab('edit');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as AdminTab);
    if (tab !== 'edit') {
      setEditingBlog(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setActiveTab('blogs');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminDashboard
            blogs={blogs}
            onCreateNew={() => setActiveTab('create')}
            onViewBlogs={() => setActiveTab('blogs')}
          />
        );
      
      case 'blogs':
        return (
          <BlogList
            blogs={blogs}
            onEdit={handleEditBlog}
            onDelete={handleDeleteBlog}
            onToggleVisibility={handleToggleBlogVisibility}
            onCreateNew={() => setActiveTab('create')}
          />
        );
      
      case 'create':
        return (
          <BlogForm
            onSubmit={handleCreateBlog}
            onCancel={() => setActiveTab('blogs')}
          />
        );
      
      case 'edit':
        return editingBlog ? (
          <BlogForm
            initialData={{
              title: editingBlog.title,
              banner: editingBlog.banner,
              images: editingBlog.images || [],
              subtitle: editingBlog.subtitle || '',
              body: editingBlog.body,
              tags: editingBlog.tags || [],
              visibility: editingBlog.visibility
            }}
            onSubmit={handleUpdateBlog}
            onCancel={handleCancelEdit}
            isEditing={true}
          />
        ) : null;
      
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Settings</h1>
            <p className="text-muted-foreground">Settings panel coming soon...</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg flex">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;
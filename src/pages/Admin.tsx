import { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import BlogList from '@/components/admin/BlogList';
import BlogForm from '@/components/admin/BlogForm';
import { Blog, BlogFormData } from '@/types/blog';
import { blogStorage } from '@/utils/blogStorage';
import { useToast } from '@/hooks/use-toast';

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
    if (isAuthenticated) {
      setBlogs(blogStorage.getAll());
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setBlogs(blogStorage.getAll());
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    setEditingBlog(null);
  };

  const handleCreateBlog = (data: BlogFormData) => {
    const newBlog = blogStorage.create(data);
    setBlogs(blogStorage.getAll());
    setActiveTab('blogs');
    toast({
      title: "Blog Created",
      description: "Your new blog post has been created successfully.",
    });
  };

  const handleUpdateBlog = (data: BlogFormData) => {
    if (!editingBlog) return;
    
    const updatedBlog = blogStorage.update(editingBlog.id, data);
    if (updatedBlog) {
      setBlogs(blogStorage.getAll());
      setEditingBlog(null);
      setActiveTab('blogs');
      toast({
        title: "Blog Updated",
        description: "Your blog post has been updated successfully.",
      });
    }
  };

  const handleDeleteBlog = (id: string) => {
    const success = blogStorage.delete(id);
    if (success) {
      setBlogs(blogStorage.getAll());
    }
  };

  const handleToggleBlogVisibility = (id: string, isVisible: boolean) => {
    const updatedBlog = blogStorage.update(id, { isVisible });
    if (updatedBlog) {
      setBlogs(blogStorage.getAll());
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
              content: editingBlog.content,
              excerpt: editingBlog.excerpt,
              isVisible: editingBlog.isVisible
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
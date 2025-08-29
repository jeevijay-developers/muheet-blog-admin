import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Eye, 
  EyeOff, 
  Plus, 
  TrendingUp,
  Calendar,
  User,
  BarChart3
} from 'lucide-react';
import { Blog } from '@/types/blog';

interface AdminDashboardProps {
  blogs: Blog[];
  onCreateNew: () => void;
  onViewBlogs: () => void;
}

const AdminDashboard = ({ blogs, onCreateNew, onViewBlogs }: AdminDashboardProps) => {
  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter(blog => blog.isVisible).length;
  const draftBlogs = blogs.filter(blog => !blog.isVisible).length;
  
  const recentBlogs = blogs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const stats = [
    {
      title: 'Total Posts',
      value: totalBlogs,
      change: '+12%',
      changeType: 'positive' as const,
      icon: FileText,
      color: 'text-primary'
    },
    {
      title: 'Published',
      value: publishedBlogs,
      change: '+8%', 
      changeType: 'positive' as const,
      icon: Eye,
      color: 'text-success'
    },
    {
      title: 'Drafts',
      value: draftBlogs,
      change: '-2%',
      changeType: 'negative' as const,
      icon: EyeOff,
      color: 'text-muted-foreground'
    },
    {
      title: 'Total Views',
      value: '1.2K',
      change: '+15%',
      changeType: 'positive' as const,
      icon: BarChart3,
      color: 'text-accent'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            ✋ Good Morning, Muheet!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your blog and recent activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onViewBlogs}>
            <FileText className="h-4 w-4 mr-2" />
            View All Posts
          </Button>
          <Button onClick={onCreateNew} className="bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Create New Post
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <span 
                        className={`text-xs font-medium ${
                          stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 ${stat.color.replace('text-', 'bg-')}/10 rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Posts
            </CardTitle>
            <CardDescription>
              Your latest blog posts and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentBlogs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No blog posts yet</p>
                <Button onClick={onCreateNew} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBlogs.map((blog) => (
                  <div key={blog.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{blog.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {blog.isVisible ? (
                        <Eye className="h-4 w-4 text-success" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
                {recentBlogs.length > 0 && (
                  <Button 
                    variant="ghost" 
                    onClick={onViewBlogs}
                    className="w-full mt-4"
                  >
                    View All Posts
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks to manage your blog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={onCreateNew}
              className="w-full justify-start bg-gradient-primary hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Blog Post
            </Button>
            
            <Button 
              onClick={onViewBlogs}
              variant="outline"
              className="w-full justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Manage All Posts
            </Button>
            
            <Button 
              variant="outline"
              className="w-full justify-start"
              disabled
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics (Coming Soon)
            </Button>
            
            <Button 
              variant="outline"
              className="w-full justify-start"
              disabled
            >
              <User className="h-4 w-4 mr-2" />
              Profile Settings (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
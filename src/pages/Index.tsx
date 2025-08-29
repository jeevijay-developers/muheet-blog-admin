import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, FileText, Edit, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Muheet Bharti's
            </span>{" "}
            Portfolio
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Explore my thoughts, ideas, and insights through my blog. 
            A collection of articles on technology, development, and more.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              <FileText className="h-5 w-5 mr-2" />
              Read Latest Posts
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/admin">
                <Shield className="h-5 w-5 mr-2" />
                Admin Panel
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Blog Management
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rich Text Editor</h3>
              <p className="text-muted-foreground">
                Create beautiful content with our advanced rich text editor featuring formatting options.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Content Management</h3>
              <p className="text-muted-foreground">
                Full CRUD operations for blog posts with visibility controls and draft management.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Track your blog performance with detailed analytics and insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Muheet Bharti. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

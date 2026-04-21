import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Brain, Sparkles, Target, TrendingUp, Trophy, CheckCircle, ArrowRight, Zap, Shield, Moon, Sun, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Questions",
      description: "Generate custom quizzes using advanced AI that adapts to your learning needs"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Customizable Difficulty",
      description: "Choose from easy, medium, or hard difficulty levels to match your skill level"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Your Progress",
      description: "Monitor your improvement over time with detailed analytics and insights"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Instant Feedback",
      description: "Get immediate explanations and correct answers after each quiz"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick & Easy",
      description: "Create quizzes in seconds with just a prompt or document upload"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is safe and secure with industry-standard protection"
    }
  ];

  const benefits = [
    "Unlimited AI-generated quizzes",
    "Multiple quiz types and formats",
    "Document upload support",
    "Comprehensive quiz history",
    "Dark mode support",
    "Mobile-friendly interface"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 dark:from-[#0F1117] dark:via-[#1A1D2E] dark:to-[#0F1117]">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-[#1A1D2E]/80 backdrop-blur-lg border-b border-blue-100 dark:border-blue-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#2F2FE4] to-[#162E93] p-2.5 rounded-xl shadow-lg">
                <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-[#1A1953] to-[#162E93] dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                  LearnEdge 2.0
                </h1>
                <p className="text-[11px] sm:text-xs text-muted-foreground -mt-0.5">AI-Powered Learning</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-[#1A1953] dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Link
                to="/login"
                className="px-5 py-2 rounded-lg text-[#1A1953] dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#2F2FE4] to-[#162E93] text-white hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
              >
                Get Started
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="inline-flex md:hidden items-center justify-center rounded-xl border border-blue-100 dark:border-blue-900/40 bg-white/90 dark:bg-[#1F2436] p-2.5 text-[#1A1953] dark:text-white shadow-sm"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="mt-4 space-y-3 rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-xl dark:border-blue-900/30 dark:bg-[#171A28]/95 md:hidden">
              <button
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-xl border border-blue-100 px-4 py-3 text-left text-[#1A1953] dark:border-blue-900/30 dark:text-white"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                <span className="font-medium">Theme</span>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-xl border border-blue-100 px-4 py-3 font-medium text-[#1A1953] transition-colors hover:bg-blue-50 dark:border-blue-900/30 dark:text-white dark:hover:bg-blue-900/20"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#2F2FE4] to-[#162E93] px-4 py-3 font-semibold text-white shadow-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#2F2FE4]" />
            <span className="text-sm font-medium text-[#1A1953] dark:text-white">AI-Powered Quiz Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#1A1953] via-[#162E93] to-[#2F2FE4] dark:from-white dark:via-blue-200 dark:to-blue-300 bg-clip-text text-transparent leading-tight">
            Master Any Subject<br />with AI-Generated Quizzes
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Transform your learning experience with intelligent quizzes tailored to your needs.
            Upload documents, set your difficulty, and track your progress—all powered by AI.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2F2FE4] to-[#162E93] text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold text-lg"
            >
              Start Learning Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white dark:bg-[#1A1D2E] text-[#1A1953] dark:text-white px-8 py-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 font-semibold text-lg"
            >
              Login
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#1A1D2E] rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 shadow-lg"
            >
              <p className="text-4xl font-bold text-[#2F2FE4] mb-2">10K+</p>
              <p className="text-muted-foreground">Quizzes Created</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-[#1A1D2E] rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 shadow-lg"
            >
              <p className="text-4xl font-bold text-[#2F2FE4] mb-2">5K+</p>
              <p className="text-muted-foreground">Active Learners</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-[#1A1D2E] rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 shadow-lg"
            >
              <p className="text-4xl font-bold text-[#2F2FE4] mb-2">95%</p>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-white/50 dark:bg-[#1A1D2E]/50 rounded-3xl my-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1A1953] dark:text-white">
              Powerful Features for Better Learning
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, take, and master quizzes effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-[#1A1D2E] rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-[#2F2FE4] to-[#162E93] w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#1A1953] dark:text-white">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1A1953] dark:text-white">
              Why Choose LearnEdge 2.0?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We've built the most comprehensive AI-powered quiz platform to help you achieve your learning goals faster and more effectively.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-1">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-[#1A1953] dark:text-white font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2F2FE4] to-[#162E93] text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold text-lg mt-8"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-[#2F2FE4] to-[#162E93] rounded-3xl p-8 shadow-2xl">
              <div className="bg-white dark:bg-[#1A1D2E] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-blue-100 dark:border-blue-900/30">
                  <h3 className="font-bold text-[#1A1953] dark:text-white">Sample Quiz</h3>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-[#2F2FE4] px-3 py-1 rounded-full font-medium">Medium</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-sm text-[#1A1953] dark:text-white font-medium mb-2">Question 1 of 10</p>
                    <p className="text-muted-foreground">What is the purpose of React hooks?</p>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white dark:bg-[#0F1117] border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3 hover:border-[#2F2FE4] transition-colors cursor-pointer">
                      <p className="text-sm text-[#1A1953] dark:text-white">A. To style components</p>
                    </div>
                    <div className="bg-white dark:bg-[#0F1117] border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3 hover:border-[#2F2FE4] transition-colors cursor-pointer">
                      <p className="text-sm text-[#1A1953] dark:text-white">B. To manage state and side effects</p>
                    </div>
                    <div className="bg-white dark:bg-[#0F1117] border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3 hover:border-[#2F2FE4] transition-colors cursor-pointer">
                      <p className="text-sm text-[#1A1953] dark:text-white">C. To create routes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#2F2FE4] to-[#162E93] rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#1A1953]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are already using LearnEdge 2.0 to master new skills and ace their exams.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-[#2F2FE4] px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold text-lg"
            >
              Start Learning Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#1A1D2E] border-t border-blue-100 dark:border-blue-900/30 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#2F2FE4] to-[#162E93] p-2 rounded-lg">
                <Brain className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-[#1A1953] dark:text-white">LearnEdge 2.0</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 LearnEdge 2.0. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

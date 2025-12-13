import React from 'react';

function InfoModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">IPL Voting Management System</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] text-white">
                    {/* Overview */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            System Overview
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                            The IPL Voting Management System is a comprehensive full-stack web application designed to facilitate 
                            real-time voting for Indian Premier League matches. Built with modern technologies and enterprise-grade 
                            security, the platform enables users to participate in match predictions while providing administrators 
                            with powerful management capabilities.
                        </p>
                    </section>

                    {/* Technical Architecture */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Technical Architecture
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-400 mb-3">Frontend Technologies</h4>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• <strong>React 18</strong> - Modern component-based UI framework</li>
                                    <li>• <strong>Tailwind CSS</strong> - Utility-first styling framework</li>
                                    <li>• <strong>Axios</strong> - HTTP client for API communication</li>
                                    <li>• <strong>React Router</strong> - Client-side routing</li>
                                    <li>• <strong>Responsive Design</strong> - Mobile-first approach</li>
                                </ul>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg">
                                <h4 className="font-semibold text-green-400 mb-3">Backend Technologies</h4>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• <strong>Spring Boot 3.x</strong> - Enterprise Java framework</li>
                                    <li>• <strong>Spring Security</strong> - Authentication & authorization</li>
                                    <li>• <strong>Spring Data JPA</strong> - Data persistence layer</li>
                                    <li>• <strong>PostgreSQL</strong> - Production database</li>
                                    <li>• <strong>JWT Tokens</strong> - Stateless authentication</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Key Features */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Key Features
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                                    <div>
                                        <h5 className="font-medium text-white">User Authentication</h5>
                                        <p className="text-gray-400 text-sm">Secure registration, login, and password management</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                                    <div>
                                        <h5 className="font-medium text-white">Real-time Voting</h5>
                                        <p className="text-gray-400 text-sm">Live match voting with duplicate prevention</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                                    <div>
                                        <h5 className="font-medium text-white">Admin Dashboard</h5>
                                        <p className="text-gray-400 text-sm">Comprehensive user and match management</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                                    <div>
                                        <h5 className="font-medium text-white">Winner Management</h5>
                                        <p className="text-gray-400 text-sm">Automated winner tracking and result processing</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                                    <div>
                                        <h5 className="font-medium text-white">Security Features</h5>
                                        <p className="text-gray-400 text-sm">Rate limiting, account lockout, and JWT security</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                                    <div>
                                        <h5 className="font-medium text-white">Responsive Design</h5>
                                        <p className="text-gray-400 text-sm">Optimized for desktop, tablet, and mobile devices</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Security & Performance */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Security & Performance
                        </h3>
                        <div className="bg-white/5 p-4 rounded-lg">
                            <ul className="text-gray-300 space-y-2">
                                <li>• <strong>JWT Authentication:</strong> Stateless, secure token-based authentication</li>
                                <li>• <strong>Password Encryption:</strong> BCrypt hashing for secure password storage</li>
                                <li>• <strong>Rate Limiting:</strong> Protection against brute force attacks</li>
                                <li>• <strong>Account Security:</strong> Automatic lockout after failed login attempts</li>
                                <li>• <strong>CORS Configuration:</strong> Secure cross-origin resource sharing</li>
                                <li>• <strong>Transaction Management:</strong> ACID compliance for data integrity</li>
                                <li>• <strong>Input Validation:</strong> Comprehensive server-side validation</li>
                            </ul>
                        </div>
                    </section>

                    {/* Deployment & Infrastructure */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Deployment & Infrastructure
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-400 mb-3">Frontend Deployment</h4>
                                <ul className="text-gray-300 space-y-1">
                                    <li>• <strong>Netlify:</strong> Continuous deployment</li>
                                    <li>• <strong>GitHub Actions:</strong> CI/CD pipeline</li>
                                    <li>• <strong>CDN:</strong> Global content delivery</li>
                                </ul>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg">
                                <h4 className="font-semibold text-green-400 mb-3">Backend Infrastructure</h4>
                                <ul className="text-gray-300 space-y-1">
                                    <li>• <strong>AWS EC2:</strong> Scalable compute instances</li>
                                    <li>• <strong>Docker:</strong> Containerized deployment</li>
                                    <li>• <strong>AWS ECR:</strong> Container registry</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="mb-6">
                        <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Contact & Support
                        </h3>
                        <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 p-4 rounded-lg border border-orange-500/30">
                            <p className="text-gray-300 mb-3">
                                For technical support, feature requests, or general inquiries about the IPL Voting Management System, 
                                please don't hesitate to reach out to our development team.
                            </p>
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <a 
                                    href="mailto:saroj.sahu1@outlook.com" 
                                    className="text-orange-400 hover:text-orange-300 transition-colors font-medium"
                                >
                                    saroj.sahu1@outlook.com
                                </a>
                            </div>
                            <p className="text-gray-400 text-sm mt-2">
                                Response time: Within 24 hours for technical inquiries
                            </p>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="text-center pt-6 border-t border-white/20">
                        <p className="text-gray-400 text-sm">
                            © 2024 IPL Voting Management System. Built with modern web technologies for optimal performance and security.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoModal;
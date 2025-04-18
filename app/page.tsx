import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, FileText, Upload, Award, ChevronDown, MessageCircle, Mail, Phone } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Coat_of_arms_of_Nigeria.svg/240px-Coat_of_arms_of_Nigeria.svg.png"
                  alt="Nigerian Coat of Arms"
                  width={40}
                  height={40}
                />
                <span className="text-sm text-gray-600 font-medium">Federal Republic of Nigeria</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Obtain Your State of Origin Certificate Easily
              </h1>
              <p className="text-lg text-gray-700">
                A streamlined digital process to verify your identity and heritage. Fast, secure, and hassle-free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/register">Apply Now</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Link href="/verify">Verify Certificate</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-200 rounded-full opacity-50"></div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Nigerian professionals with certificate"
                  width={500}
                  height={400}
                  className="rounded-md shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our digital platform simplifies the process of obtaining your State of Origin Certificate with these key
              benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
              <p className="text-gray-600">
                Get your certificate processed quickly with our streamlined digital workflow and approval system.
              </p>
            </div>

            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Documentation</h3>
              <p className="text-gray-600">
                Your documents and personal information are protected with enterprise-grade security measures.
              </p>
            </div>

            <div className="bg-teal-50 p-6 rounded-lg border border-teal-100">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Verification</h3>
              <p className="text-gray-600">
                Certificates can be easily verified online by authorized parties using our verification system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How To Apply Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How To Apply</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these four simple steps to obtain your certificate of origin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="absolute top-0 left-6 h-full w-0.5 bg-green-200 -z-10 md:block hidden"></div>
              <div className="flex flex-col items-center md:items-start">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mb-4 font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-gray-600 text-center md:text-left">
                  Register on our platform with your email and create a secure password to get started.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-6 h-full w-0.5 bg-green-200 -z-10 md:block hidden"></div>
              <div className="flex flex-col items-center md:items-start">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mb-4 font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Fill in Your Details</h3>
                <p className="text-gray-600 text-center md:text-left">
                  Provide your personal information and details about your state of origin.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-6 h-full w-0.5 bg-green-200 -z-10 md:block hidden"></div>
              <div className="flex flex-col items-center md:items-start">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mb-4 font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Documents</h3>
                <p className="text-gray-600 text-center md:text-left">
                  Upload supporting documents to verify your identity and connection to your state.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mb-4 font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Certificate</h3>
              <p className="text-gray-600 text-center md:text-left">
                Once approved, download your certificate or have it sent to your email.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/register">Start Application</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 relative order-2 md:order-1">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-200 rounded-full opacity-50"></div>
              <div className="relative bg-white p-4 rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1604881991720-f91add269bed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Nigerian government officials"
                  className="rounded-md w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
            <div className="md:w-1/2 space-y-6 order-1 md:order-2">
              <h2 className="text-3xl font-bold">About Our Service</h2>
              <p className="text-gray-600">
                The State of Origin Certificate Portal offers a streamlined procedure for acquiring the official State
                of Origin Certificate. Our mission is to empower individuals by preserving and commemorating their
                distinct identities, thereby showcasing the rich heritage of our state.
              </p>
              <p className="text-gray-600">
                Recognizing the significance of this document in establishing one's roots and local connections, we have
                developed a user-friendly platform designed to enhance the application process, ensuring it is
                efficient, secure, and devoid of unnecessary complications.
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our State of Origin Certificate process
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <button className="flex justify-between items-center w-full text-left">
                <h3 className="text-lg font-medium">How do I apply for my State of Origin Certificate?</h3>
                <ChevronDown className="h-5 w-5 text-green-600" />
              </button>
              <div className="mt-2 text-gray-600">
                <p>
                  To apply, create an account on our platform, fill in your personal details, upload the required
                  documents, and submit your application. Our team will review it and process your certificate.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <button className="flex justify-between items-center w-full text-left">
                <h3 className="text-lg font-medium">After login, what is next?</h3>
                <ChevronDown className="h-5 w-5 text-green-600" />
              </button>
              <div className="mt-2 text-gray-600">
                <p>
                  After logging in, you'll be directed to your dashboard where you can start a new application, check
                  the status of existing applications, and view or download your certificates.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <button className="flex justify-between items-center w-full text-left">
                <h3 className="text-lg font-medium">How long should I wait before getting my certificate?</h3>
                <ChevronDown className="h-5 w-5 text-green-600" />
              </button>
              <div className="mt-2 text-gray-600">
                <p>
                  The processing time is typically 2-3 business days after all required documents have been submitted
                  and verified. You'll receive an email notification once your certificate is ready.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              View All FAQs
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? Reach out to our support team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-green-50 p-6 rounded-lg border border-green-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat with us</h3>
              <p className="text-gray-600 mb-4">Get instant support through our live chat service</p>
              <Button variant="outline" className="mt-auto border-green-600 text-green-600 hover:bg-green-50">
                Start Chat
              </Button>
            </div>

            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email us</h3>
              <p className="text-gray-600 mb-4">Send us an email and we'll respond within 24 hours</p>
              <Button variant="outline" className="mt-auto border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                Send Email
              </Button>
            </div>

            <div className="bg-teal-50 p-6 rounded-lg border border-teal-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call us</h3>
              <p className="text-gray-600 mb-4">Speak directly with our support team</p>
              <Button variant="outline" className="mt-auto border-teal-600 text-teal-600 hover:bg-teal-50">
                Call Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-6 w-6 text-green-400" />
                <span className="font-bold text-xl">StateOrigin</span>
              </div>
              <p className="text-gray-400 mb-4">
                Simplifying the process of obtaining your official Certificate of Origin. Our mission is to empower
                citizens by preserving and celebrating their unique identities.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/how-to-apply" className="text-gray-400 hover:text-white transition-colors">
                    How to Apply
                  </Link>
                </li>
                <li>
                  <Link href="/verify" className="text-gray-400 hover:text-white transition-colors">
                    Verify Certificate
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="text-gray-400 hover:text-white transition-colors">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
{/* 
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="not-italic text-gray-400">
                <p className="mb-2">State Government Office</p>
                <p className="mb-2">Block 5a State Secretariat, Government House</p>
                <p className="mb-4">+234 803 456 7890 • +234 905 678 1234</p>
                <p>Open Hours: Mon - Fri, 8:00 am - 4:00 pm</p>
              </address>
            </div> */}
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 State of Origin Certificate Portal - All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

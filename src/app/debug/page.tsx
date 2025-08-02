import FirebaseDebugTest from '@/components/FirebaseDebugTest';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Firebase Debug Console</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FirebaseDebugTest />
          
          <div className="p-6 bg-white border rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Debug Instructions</h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-600">Step 1: Run Firebase Test</h4>
                <p>Click "Run Firebase Test" to verify basic Firebase operations are working.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-600">Step 2: Test the Estimator</h4>
                <p>Open the main estimator form and check browser console for debug logs:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Fill Step 1 (personal info) - Look for document creation logs</li>
                  <li>Fill Step 2 (app description) - Look for document update logs</li>
                  <li>Check Firebase console to see if data is saved</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-600">Debug Log Symbols</h4>
                <ul className="list-none space-y-1 ml-4">
                  <li>🔍 DEBUG: Information about function calls and data</li>
                  <li>✅ Success: Operation completed successfully</li>
                  <li>❌ Error: Something went wrong</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-red-600">Common Issues</h4>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>userDocumentId is null/undefined</li>
                  <li>Firebase permissions error</li>
                  <li>Network connectivity issues</li>
                  <li>State not persisting between steps</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Keep your browser's developer console open (F12) to see all debug logs
                while testing the estimator form.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
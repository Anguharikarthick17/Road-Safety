import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseClient: any;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase environment variables are missing. Database integrations will run in fallback mock mode.');
  
  // Create a recursive mock/proxy builder to handle arbitrary Supabase calls
  const createMock = (): any => {
    const mockTarget = () => {};
    
    const proxy: any = new Proxy(mockTarget, {
      get(target, prop): any {
        // Handle standard Promise/thenable properties
        if (prop === 'then') {
          return (resolve: any, reject: any) => {
            const p = Promise.resolve({ data: [], error: null });
            return resolve ? p.then(resolve) : p;
          };
        }
        
        // Handle subscribing to real-time events
        if (prop === 'subscribe') {
          return () => ({ unsubscribe: () => {} });
        }
        if (prop === 'on' || prop === 'channel') {
          return () => proxy;
        }
        if (prop === 'removeChannel') {
          return () => {};
        }
        
        // Handle requesting a single record (e.g. .single())
        if (prop === 'single') {
          return () => ({
            then: (resolve: any, reject: any) => {
              const p = Promise.resolve({ data: null, error: null });
              return resolve ? p.then(resolve) : p;
            }
          });
        }
        
        // Otherwise, return a function that returns the same proxy to allow chaining
        return () => proxy;
      },
      
      apply(target, thisArg, argumentsList) {
        // If the proxy itself is called as a function (like a chain method), return the proxy to allow further chaining
        return proxy;
      }
    });
    
    return proxy;
  };
  
  supabaseClient = createMock();
}

export const supabase = supabaseClient;


// test
export async function pingMySql() {
    try {
      const response = await fetch('http://localhost:3000/users');
      
      if (!response.ok) {
        return { 
          ok: false, 
          error: `HTTP ${response.status}` 
        };
      }
      
      const data = await response.json();
      return { 
        ok: true, 
        now: `Users count: ${data.length}`,
        data 
      };
    } catch (error: any) {
      return { 
        ok: false, 
        error: error.message 
      };
    }
  }
import { useState, useCallback, useEffect, useRef } from 'react'

function App() {
  const [count, setCount] = useState(8)
  const [numAllowed, setNumAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState("")
  const [strength, setStrength] = useState("weak")
  const [copied, setCopied] = useState(false)
  
  const passwordRef = useRef(null)

  useEffect(() => {
    let pass = "" 
    let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let num = "0123456789"
    let char = "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if(numAllowed){
        str += num
    }
    if(charAllowed){
        str += char
    }

    for(let i = 0; i < count; i++){
        const random = Math.floor(Math.random() * str.length)
        pass += str[random]
    }

    setPassword(pass)

    // Determine password strength
    if(count > 10 && charAllowed && numAllowed){
      setStrength("strong")
    } else if ((count > 8 && (charAllowed || numAllowed)) || (count > 12)) {
      setStrength("medium")
    } else {
      setStrength("weak")
    }
  }, [count, numAllowed, charAllowed])

  const copyPassword = useCallback(() => {
    passwordRef.current?.select()
    window.navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [password])
  
  const getStrengthColor = () => {
    switch(strength) {
      case "strong": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "weak": return "bg-red-500";
      default: return "bg-red-500";
    }
  }

  const getStrengthWidth = () => {
    switch(strength) {
      case "strong": return "w-full";
      case "medium": return "w-2/3";
      case "weak": return "w-1/3";
      default: return "w-1/3";
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md rounded-xl shadow-lg bg-gray-800 p-6">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Password Generator</h1>
        
        <div className="relative mb-6">
          <input 
            type="text" 
            value={password} 
            className="w-full p-4 pr-12 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your password" 
            ref={passwordRef} 
            readOnly
          />
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-all duration-200"
            onClick={copyPassword}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-400 mb-2 text-sm">
            Password Strength
          </label>
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full ${getStrengthColor()} ${getStrengthWidth()} transition-all duration-300`}></div>
          </div>
          <p className="text-right text-sm text-gray-400 mt-1 capitalize">{strength}</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-400 text-sm">Length: {count}</label>
          </div>
          <input 
            type="range" 
            min={6} 
            max={15} 
            value={count}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            onChange={(e) => setCount(parseInt(e.target.value))}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center bg-gray-700 p-3 rounded-lg">
            <input 
              type="checkbox" 
              id="numbers"
              checked={numAllowed} 
              onChange={() => setNumAllowed(!numAllowed)}
              className="mr-3 h-4 w-4 accent-blue-600" 
            />
            <label htmlFor="numbers" className="text-gray-300">Include Numbers</label>
          </div>
          
          <div className="flex items-center bg-gray-700 p-3 rounded-lg">
            <input 
              type="checkbox" 
              id="special"
              checked={charAllowed} 
              onChange={() => setCharAllowed(!charAllowed)}
              className="mr-3 h-4 w-4 accent-blue-600" 
            />
            <label htmlFor="special" className="text-gray-300">Include Symbols</label>
          </div>
        </div>
        
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-200 font-medium"
          onClick={() => {
            // Generate a new password
            let event = new Event('change');
            // Trigger a re-render by "changing" one of the dependencies
            setCount(prev => {
              setTimeout(() => setCount(prev), 0);
              return prev === 20 ? 19 : prev + 1;
            });
          }}
        >
          Generate New Password
        </button>
      </div>
    </div>
  );
}

export default App
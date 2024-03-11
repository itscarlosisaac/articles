
export default function Register() {

    async function onSubmit(event){
        event.preventDefault();
        try {
            const data = new FormData(event.target);
            const entries = data.entries()
            const payload = {}
            let done = false
            while ( !done ) {
                const current = entries.next()
                done = current.done;
                if( done ) continue;
                payload[current.value[0]] = current.value[1]
            }
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            console.log("response", response)
        }catch(e) {
            console.error(e)
        }
    }

  return (
    <>
        <form onSubmit={onSubmit}>
            <div className='form-control'>
                <label htmlFor="username">Username:</label>
                <input type='text' name="username" placeholder="Username" />
            </div>
            <div className='form-control'>
                <label htmlFor="email">Email:</label>
                <input type='email' name="email" placeholder="Email"/>
            </div>
            <div className='form-control'>
                <label htmlFor="password">Password:</label>
                <input type='password' name="password" placeholder="*******"/>
            </div>
            <div>
                <button type="submit">Register</button>
            </div>
        </form>
    </>
  )
}
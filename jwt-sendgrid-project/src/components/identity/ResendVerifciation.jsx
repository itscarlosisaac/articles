
export default function ResendVerifciation() {

    async function onSubmit(event){
        event.preventDefault();
        try {
            const data = new FormData(event.target);
            const email = data.get('email')
            const response = await fetch("http://localhost:3000/api/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email})
            }).then(res => res.json())
            console.log("response", response)
        }catch(e) {
            console.error(e)
        }
    }

  return (
    <>
        <form onSubmit={onSubmit}>
            <h2>Resend Email verification</h2>
            <div className='form-control'>
                <label htmlFor="email">Email:</label>
                <input type='email' name="email" placeholder="Email"/>
            </div>
            <div>
                <button type="submit">Resend Email</button>
            </div>
        </form>
    </>
  )
}
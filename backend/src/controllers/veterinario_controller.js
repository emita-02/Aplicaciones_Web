
import Veterinario from "../models/Veterinario.js"
import { sendMailToRegister } from "../helpers/sendMail.js"

const registro = async (req,res)=>{

    try {
        const {email,password} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const verificarEmailBDD = await Veterinario.findOne({email})
        if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
        const nuevoVeterinario = new Veterinario(req.body)
        nuevoVeterinario.password = await nuevoVeterinario.encryptPassword(password)
        const token = nuevoVeterinario.createToken()
        await sendMailToRegister(email,token)
        await nuevoVeterinario.save()
        res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})

    } catch (error) {
        console.log(error)
    }

}

const confirmarMail = async (req, res) => {
    try {
        // Paso 1 
        const { token } = req.params
        // Paso 2
        const veterinarioBDD = await Veterinario.findOne({ token })
        if (!veterinarioBDD) return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" })
        // Paso 3
        veterinarioBDD.token = null
        veterinarioBDD.confirmEmail = true
        await veterinarioBDD.save()
        // Paso 4
        res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" })

    } catch (error) {
    console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}


export {
    registro,
    confirmarMail
}
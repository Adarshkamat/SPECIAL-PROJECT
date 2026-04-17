import { Context } from "koa"
import { analyzeImage } from "../services/gemini"

export default {
    async analyze(ctx:Context){
        const file =  ctx.request.files?.image as any

        if(!file) return ctx.badRequest("No image uploaded")

        const filePath = file.filepath

        try{
            const result = await analyzeImage(filePath)
            return ctx.send({sucess:true,result })

        }catch(err){
                ctx.internalServerError("Analysis failed",{error: err.message})
        }
    }
}
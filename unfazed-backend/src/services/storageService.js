const fs=require("fs/promises"),path=require("path");
const uploadFile=async({buffer,originalName})=>{const dir=path.join(process.cwd(),"uploads");await fs.mkdir(dir,{recursive:true});const key=`${Date.now()}-${String(originalName||"file").replace(/[^a-zA-Z0-9._-]/g,"_")}`;await fs.writeFile(path.join(dir,key),buffer);return{provider:"local",key,url:`/uploads/${key}`};};
module.exports={uploadFile};

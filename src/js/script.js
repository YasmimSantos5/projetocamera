//DECLARAÇÕES DOS ELEMENTOS

const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

// MÉTODO HABILITAR CÂMERA

async function configurarCamera(){
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video: {facingMode:"environment"},
            audio: false

        });

        videoElemento.srcObject = midia;
        videoElemento.onplay();



    }catch(erro){
        resultado.innerText= "Erro ao acessar a câmera", erro;
    }
}

configurarCamera();

botaoScanear.onclick = async ()=>{
        botaoScanear.ariaDisabled = true;
        resultado.innerText = "Fazendo a leitura ...aguarde";

        //PREPARAR O CENARIO
        const contexto = canvas.getContext("2d")

        //AJUSTAR TAMANHO 
        canvas.width = videoElemento.videoWidth;
        canvas.height = videoElemento.videoHeight;

        //LIMPE E GARANTE QUE A ORIENTAÇÃO SEJA A PADRÃO (NÃO ESPELHA)
        contexto.setTransform(1,0,0,1,0,0);

        contexto.filter="contrast (1.2) grayscale(1)"; 

        contexto.drawImage(videoElemento, 0, 0, canvas.width,canvas.height);

        try{
            const {data: {text}} = await Tesseract.recognize(
                canvas,
                'por'
            );
            const textoFinal = text.trim();
            resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não foi possivel capturar o texto"
        }catch(erro){
            console.error(erro);
            resultado.innerText = "Erro no processamento", erro;
        } finally {
              botaoScanear.disabled= false;
    }
}


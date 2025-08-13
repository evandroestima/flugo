import React, { useEffect, useState } from "react";
import LinearProgress, {
  type LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Switch } from "@mui/material";
import { Autocomplete } from "@mui/material";

import { db, collection, addDoc } from "../firebase";
import { useRegistering } from "../contexts/registeringContext";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const departamentosMock = [
  { label: "Recursos Humanos" },
  { label: "Tecnologia da Informação" },
  { label: "Marketing" },
  { label: "Vendas" },
  { label: "Financeiro" },
];

const TelaCadastro: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [titulo, setTitulo] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [departamento, setDepartamento] = useState();
  const [activateSwitch, setActivateSwitch] = useState(true);
  const [steps] = useState([
    {
      label: "Informações Pessoais",
      description: "Preencha seus dados pessoais.",
    },
    { label: "Contato", description: "Informe seu e-mail e telefone." },
    { label: "Departamento", description: "Selecione o departamento." },
  ]);
  const { setIsRegistering } = useRegistering();
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    setProgress(
      activeStep === steps.length - 1
        ? 100
        : (activeStep / (steps.length - 1)) * 100
    );
  }, [activeStep]);

  const handleNext = () => {
    if (activeStep !== steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      //   if (titulo || email || departamento === undefined) {
      //     console.log("entrou aqui");
      //     return (
      //       <Alert severity="error">
      //         Preencha todos os campos antes de continuar.
      //       </Alert>
      //     );
      //   }

      const docRef = await addDoc(collection(db, "colaboradores"), {
        titulo,
        email,
        departamento: departamento,
        ativo: activateSwitch,
      });

      setIsRegistering(false);
      setActiveStep(0);
      console.log("Document written with ID: ", docRef.id);
      //   handleNext();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div style={styles.cadastroContainer}>
      <div style={styles.cadastroHeader}>
        Colaboradores . Cadastrar Colaborador
      </div>
      <LinearProgressWithLabel variant="determinate" value={progress} />

      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key={steps[0].label}>
          <StepLabel>{steps[0].label}</StepLabel>
          <StepContent>
            <Typography>{steps[0].description}</Typography>
            <Box sx={{ mb: 2 }}>
              <div>
                <TextField
                  label="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  margin="normal"
                  fullWidth
                  required
                />
              </div>
              <div>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  fullWidth
                  required
                />
              </div>
              <Switch
                checked={activateSwitch}
                onChange={() => setActivateSwitch(!activateSwitch)}
                inputProps={{ "aria-label": "controlled" }}
              />
              Ativar ao criar
            </Box>
          </StepContent>
        </Step>
        {/* TODO: TIRAR O BOTÃO DE CONTINUAR DO LOCAL E BOTAR GLOBAL. CONTROLAR PELO STEP QUE TÁ XD */}
        <Step>
          <StepLabel>{steps[1].label}</StepLabel>
          <StepContent>
            <Typography>{steps[1].description}</Typography>
            <Box sx={{ mb: 2 }}>
              <div>
                <Autocomplete
                  disablePortal
                  options={departamentosMock}
                  sx={{ width: 300, marginTop: 2, marginBottom: 2 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Departamento" />
                  )}
                  value={departamento}
                  onChange={(_event: any, newValue: any) => {
                    setDepartamento(newValue);
                  }}
                  noOptionsText="Nenhum departamento encontrado"
                />
              </div>
            </Box>
          </StepContent>
        </Step>
      </Stepper>
      <div>
        <Button
          variant="contained"
          onClick={() => {
            activeStep !== steps.length - 1 ? handleNext() : handleSubmit();
          }}
          sx={{ mt: 1, mr: 1 }}
        >
          {activeStep === steps.length - 1 ? "Finalizar" : "Continuar"}
        </Button>
      </div>
      <div>
        <Button
          variant="contained"
          onClick={() => {
            handleBack();
          }}
          sx={{ mt: 1, mr: 1 }}
        >
          voltar
        </Button>
      </div>
    </div>
  );
};

export default TelaCadastro;

const styles = {
  cadastroContainer: {
    padding: "20px",
  },
  cadastroHeader: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  colaboradoresButton: {
    marginBottom: "20px",
    padding: "10px 20px",
    backgroundColor: "#3f51b5",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

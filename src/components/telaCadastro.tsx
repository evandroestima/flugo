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
import Alert from "@mui/material/Alert";

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
    },
    { label: "Informações profissionais" },
    { label: "Departamento" },
  ]);
  const { setIsRegistering } = useRegistering();
  const [activeStep, setActiveStep] = React.useState(0);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setProgress(
      activeStep === steps.length - 1
        ? 100
        : (activeStep / (steps.length - 1)) * 100
    );
  }, [activeStep]);

  const handleNext = () => {
    if (activeStep !== steps.length - 1) {
      if (!titulo || !email) {
        setShowAlert(true);
        // alert("Por favor, preencha todos os campos antes de continuar.");
        return;
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setShowAlert(false);
    }
  };
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
    if (activeStep === 0) {
      setIsRegistering(false);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting:", {
        titulo,
        email,
        departamento,
        ativo: activateSwitch,
      });

      if (!titulo || !email || !departamento) {
        setShowAlert(true);
        return;
      }

      await addDoc(collection(db, "colaboradores"), {
        titulo,
        email,
        departamento: departamento,
        ativo: activateSwitch,
      });

      setIsRegistering(false);
      setActiveStep(0);
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
      <LinearProgressWithLabel
        variant="determinate"
        value={progress}
        sx={{
          backgroundColor: "#c5daceff",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#25c362", // The color of the progress bar
          },
        }}
      />

      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        sx={{
          // Target the step icon
          "& .MuiStepIcon-root.MuiStepIcon-active": {
            color: "#a4b4aaff",
          },
          // Target the completed step icon
          "& .MuiStepIcon-root.Mui-completed": {
            color: "#25c362",
          },
          // Target the connector line
          "& .MuiStepConnector-line": {
            borderColor: "#25c362",
          },
          "& .Mui-active": {
            color: "#25c362",
          },
        }}
      >
        <Step key={steps[0].label}>
          <StepLabel>
            <div style={styles.stepLabelContainer}>
              {steps[0].label}
              <h2>Informações básicas</h2>
            </div>
          </StepLabel>
          <StepContent>
            <Box sx={{ mb: 2 }}>
              <div>
                <TextField
                  label="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  margin="normal"
                  fullWidth
                  required
                  // color="success"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#25c362", // Default border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#1ba04eff", // Hover border color
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#25c362", // Focused border color
                      },
                    },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#25c362", // Default border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#1ba04eff", // Hover border color
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#25c362", // Focused border color
                      },
                    },
                  }}
                />
              </div>
              <Switch
                checked={activateSwitch}
                onChange={() => setActivateSwitch(!activateSwitch)}
                inputProps={{ "aria-label": "controlled" }}
                sx={{
                  "& .MuiSwitch-thumb": {
                    backgroundColor: "#25c362", // Thumb color
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: "#25c362", // Track color
                  },
                  "& .MuiSwitch-root": {
                    color: "#25c362", // Track color when checked
                    backgroundColor: "#25c362", // Color when checked
                  },
                }}
              />
              Ativar ao criar
              {showAlert && (
                <Alert severity="error" onClose={() => setShowAlert(false)}>
                  Por favor, preencha todos os campos antes de continuar.
                </Alert>
              )}
            </Box>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>
            <div style={styles.stepLabelContainer}>
              {steps[1].label}
              <h2>Informações profissionais</h2>
            </div>
          </StepLabel>
          <StepContent>
            <Box sx={{ mb: 2 }}>
              <div>
                <Autocomplete
                  disablePortal
                  options={departamentosMock}
                  sx={{
                    width: 300,
                    marginTop: 2,
                    marginBottom: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#25c362", // Default border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#1ba04eff", // Hover border color
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#25c362", // Focused border color
                      },
                    },
                  }}
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
              {showAlert && (
                <Alert severity="error" onClose={() => setShowAlert(false)}>
                  Por favor, preencha o campo antes de continuar.
                </Alert>
              )}
            </Box>
          </StepContent>
        </Step>
      </Stepper>
      <div style={styles.buttonContainer}>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              handleBack();
            }}
            sx={{ mt: 1, mr: 1 }}
            style={styles.telaCadastroButton}
          >
            voltar
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            style={styles.telaCadastroButton}
            onClick={() => {
              activeStep !== steps.length - 2 ? handleNext() : handleSubmit();
            }}
            sx={{
              mt: 1,
              mr: 1,
            }}
          >
            {activeStep === steps.length - 2 ? "Finalizar" : "Próximo"}
          </Button>
        </div>
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
  telaCadastroButton: {
    backgroundColor: "#25c362",
    height: "50px",
    borderRadius: "10px",
  },
  stepLabelContainer: {
    color: "#746565ff",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
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

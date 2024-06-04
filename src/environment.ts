const production = false;

const commonEnvironment = {
    CLIENT_URL : ""
    
}

const prodEnvironment = {
    CLIENT_URL : ""
}

const localEnvironment = {
    CLIENT_URL : ""
}

export const environment = { ...(production ? prodEnvironment : localEnvironment), ...commonEnvironment };
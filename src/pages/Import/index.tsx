import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';
import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer, Error } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [hasError, setHasError] = useState('');
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();
    if (uploadedFiles.length) {
      data.append('file', uploadedFiles[0].file);
      setHasError('');
    } else {
      setHasError('Arquivo não selecionado');
      return;
    }
    try {
      await api.post('/transactions/import', data);

      // alert('Importação efetuada.');
      history.push('/');
    } catch (err) {
      setHasError('Ocorreu um erro na importação');
    }
  }

  function submitFile(files: File[]): void {
    const filesUploaded = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));
    setUploadedFiles(filesUploaded);
    setHasError('');
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
          {hasError && <Error>{hasError}</Error>}
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;

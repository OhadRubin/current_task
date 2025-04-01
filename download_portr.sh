curl -L https://github.com/amalshaji/portr/releases/download/0.0.35-beta/portr_0.0.35-beta_Linux_x86_64.zip -o portr.zip
mkdir -p portr_extracted && unzip portr.zip -d portr_extracted
cp portr_extracted/portr portr
rm -rf portr_extracted
rm portr.zip






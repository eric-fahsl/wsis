echo "Deleting existing /var/www/ directory"
sudo rm -r /var/www/*
echo "DONE Deleting existing /var/www/ directory"

echo "Copying PHP lib folder"
sudo cp php/lib /var/www/
echo "DONE Copying PHP lib folder"

echo "Copying spa/dist folder to /var/www"
sudo cp -r spa/dist/* /var/www
echo "DONE Copying spa/dist folder to /var/www"
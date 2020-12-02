/**
 * @function Report Plus for kintone
 * @author Copyright (c) Usshi-
 * @license MIT License
 * @since 2020
*/

(() => {

  "use strict";
  
  const elBody = document.getElementsByTagName('body')[0];

  // Show record index
  kintone.events.on('app.record.index.show', event => {

    const fieldName = 'Header'
    const elSpace = kintone.app.getHeaderMenuSpaceElement();
    if (!checkField(elSpace, fieldName)) {
      return false;
    }
    
    const dialog = setDialogButton(elSpace);
    // Click dialog button, preview reports
    dialog.on('click', () => {
      
      // Create report data
      let data = '';
      event.records.forEach(record => {
        data += '# ' + (record['Group']['value'] || '') + '\n';
        data += (record['Report']['value'] || '');
      });

      // Copy data and setting markdown data 
      const btnCopy = executeCopy(data);
      const markdownData = setMarkdown('markdown-body', data);
      setDialog(markdownData, btnCopy);
      
    });
  });

  // Show record detail
  kintone.events.on('app.record.detail.show', event => {
    
    // Exist Report fieldcode
    const fieldName = 'Report'
    const elReport = kintone.app.record.getFieldElement(fieldName);
    if (!checkField(elReport, fieldName)) {
      return false;
    }
   
    // Setting markdown data 
    const elMarkdown = setMarkdown('markdown-body markdown-detail', (event.record['Report']['value'] || ''));
    elReport.innerHTML = '';
    elReport.appendChild(elMarkdown);

  });
  
  // Show record new and edit
  const ev = [
    'app.record.create.show',
    'app.record.edit.show'
  ];
  kintone.events.on(ev, event => {

    const fieldName = 'Space'
    const elSpace = kintone.app.record.getSpaceElement(fieldName);
    if (!checkField(elSpace, fieldName)) {
      return false;
    }
    
    const dialog = setDialogButton(elSpace);
    // Click dialog button, preview reports
    dialog.on('click', () => {
      
      // Create report data
      const record = kintone.app.record.get();
      let data = '';
      data += '# ' + (record.record['Group']['value'] || '') + '\n';
      data += (record.record['Report']['value'] || '');
      
      // Copy data and setting markdown data 
      const btnCopy = executeCopy(data);
      const markdownData = setMarkdown('markdown-body', data);
      setDialog(markdownData, btnCopy);
      
    });
  });
  
  
  // Check field
  const checkField = (el, message) => {

    if (!el) {
      const alert = new kintoneUIComponent.Alert({text: 'Not found ' + message + ' field.', type: 'error'});
      elBody.appendChild(alert.render());
      alert.show();
      return false;
    }
    
    return true;
  }

  // Setting dialog button
  const setDialogButton = (el) => {

    const btnDialog = new kintoneUIComponent.Button({
      text: 'PeportPlus',
      type: 'submit'
    });
    el.appendChild(btnDialog.render());

    return btnDialog;
  }

  // Setting data for dialog text
  const setDialog = (data, btnCopy) => {

    // Create report dialog
    const dlgReport = new kintoneUIComponent.Dialog({
      header: 'Report Plus',
      content: data,
      footer: btnCopy.render(),
      isVisible: true,
      showCloseButton: true
    });
    elBody.appendChild(dlgReport.render());
    dlgReport.show();
    
    // Click close button  
    document.getElementsByClassName('kuc-dialog-close-button')[0].onclick = () => {
      const elClose = document.getElementsByClassName('kuc-notify')[0];
      if (elClose) {
        elClose.style.display = 'none';
      };
    };
  }
  
  // Copy markdown data
  const executeCopy = (data) => {

    const btnCopy = new kintoneUIComponent.Button({
      text: 'コピーする',
      type: 'submit'
    });

    // Click copy button 
    btnCopy.on('click', () => {
          
      let elCopy = document.getElementById('report-plus-copytext');
      if (!elCopy) {
        elCopy = document.createElement('textarea');
        elCopy.id = 'report-plus-copytext';
        elBody.appendChild(elCopy);
      }
        
      // Copy clipboard
      elCopy.textContent = data;
      elCopy.select();
      document.execCommand('copy');
      elCopy.hidden = true;
        
      // Success pooup
      const popup = new kintoneUIComponent.NotifyPopup({
        text: 'Copied to clipboard.',
        type: 'success'
      });

      if (!document.getElementsByClassName('kuc-notify')[0]) {
        elBody.appendChild(popup.render());
      } else {
        document.getElementsByClassName('kuc-notify')[0].style.display = 'block';
      }
    });
    
    return btnCopy;
  }
  
  // Setting html data for markdown data
  const setMarkdown = (className, data) => {
    const markdown = document.createElement('div');
    markdown.className = className;

    marked.setOptions({
      'breaks' : true
    });
    markdown.innerHTML = marked(data);

    return markdown;
  }
  
})();

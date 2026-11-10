/**
 * Authentic Document Templates (Feature F18 - R5)
 * Realistic workplace UI templates for TOEIC Part 6 & 7 reading passages.
 * Supports: Corporate Gmail, Electronic VAT Invoice, Airline Boarding Pass, Slack Workspace.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AuthenticDocumentTemplates = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class AuthenticDocumentTemplates {
    constructor() {
      this.supportedTypes = ['Email', 'Invoice', 'BoardingPass', 'Slack'];
    }

    /**
     * Escape HTML entities to prevent XSS
     */
    escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    /**
     * Escape HTML entities and preserve newlines as safe paragraphs
     */
    renderSafeParagraphs(text, fallbackHtml) {
      if (!text) return fallbackHtml;
      return `<p>${this.escapeHtml(String(text)).replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`;
    }

    /**
     * Sanitize rich HTML by stripping dangerous tags, slash/space event handlers, and script URLs
     */
    sanitizeHtml(rawHtml) {
      if (!rawHtml) return '';
      let clean = String(rawHtml);
      clean = clean.replace(/<(script|iframe|object|embed|style|svg|math|form|input|textarea|select|button|details|template|link|meta|base)\b[\s\S]*?(?:<\/\1>|\/?>)/gi, '');
      clean = clean.replace(/(?:^|[\s/])on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
      clean = clean.replace(/(?:href|src|action|formaction)\s*=\s*(?:"[^"]*(?:javascript|vbscript|data\s*:\s*text\/html)[^"]*"|'[^']*(?:javascript|vbscript|data\s*:\s*text\/html)[^']*'|[^\s>]*(?:javascript|vbscript)[^\s>]*)/gi, 'href="#"');
      return clean;
    }

    /**
     * Normalize docType string
     */
    normalizeType(docType) {
      if (!docType || typeof docType !== 'string') return 'Generic';
      const clean = docType.trim().toLowerCase();
      if (clean.includes('email') || clean.includes('gmail') || clean.includes('mail')) return 'Email';
      if (clean.includes('invoice') || clean.includes('vat') || clean.includes('bill') || clean.includes('receipt')) return 'Invoice';
      if (clean.includes('boarding') || clean.includes('flight') || clean.includes('pass') || clean.includes('ticket')) return 'BoardingPass';
      if (clean.includes('slack') || clean.includes('chat') || clean.includes('channel') || clean.includes('message')) return 'Slack';
      return 'Generic';
    }

    /**
     * Main render entrypoint
     * @param {string} docType 'Email' | 'Invoice' | 'BoardingPass' | 'Slack' | other
     * @param {Object|string} content
     * @returns {string} Semantic HTML string
     */
    render(docType, content) {
      const type = this.normalizeType(docType);
      switch (type) {
        case 'Email':
          return this.renderGmail(content);
        case 'Invoice':
          return this.renderInvoice(content);
        case 'BoardingPass':
          return this.renderBoardingPass(content);
        case 'Slack':
          return this.renderSlack(content);
        default:
          return this.renderFallback(docType, content);
      }
    }

    /**
     * Template 1: Corporate Gmail / Outlook Webmail
     */
    renderGmail(data = {}) {
      const d = typeof data === 'string' ? { body: data } : (data || {});
      const subject = this.escapeHtml(d.subject || 'Project Status Update');
      const senderName = this.escapeHtml(d.senderName || d.sender || 'Sarah Jenkins');
      const senderEmail = this.escapeHtml(d.senderEmail || d.email || 'sjenkins@nexuscorp.com');
      const recipient = this.escapeHtml(d.recipient || d.to || 'all-team@nexuscorp.com');
      const timestamp = this.escapeHtml(d.timestamp || d.date || 'Today, 09:42 AM');
      const messageId = this.escapeHtml(d.messageId || 'MSG-2026-X89');
      const rawBody = d.bodyHtml || d.body || '';
      const bodyHtml = this.renderSafeParagraphs(rawBody, '<p>No content provided.</p>');
      
      const initials = (senderName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'SJ').toUpperCase();

      let attachmentHtml = '';
      if (d.attachment || d.attachmentName) {
        const attName = this.escapeHtml(d.attachmentName || (typeof d.attachment === 'string' ? d.attachment : 'Quarterly_Report.pdf'));
        const attSize = this.escapeHtml(d.attachmentSize || '1.8 MB');
        attachmentHtml = `
          <div class="mx-4 sm:mx-6 mb-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center text-sm font-bold">PDF</span>
              <div>
                <div class="font-bold text-slate-800 dark:text-slate-200 text-xs">${attName}</div>
                <div class="text-[10px] text-slate-400">${attSize}</div>
              </div>
            </div>
            <span class="text-indigo-600 dark:text-indigo-400 font-bold text-xs cursor-pointer hover:underline">Download</span>
          </div>
        `;
      }

      return `
        <div class="webmail-view rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden font-sans text-xs">
          <!-- Gmail Top Toolbar -->
          <div class="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-2 text-slate-500">
              <span class="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span class="ml-2 font-mono font-bold text-[11px] text-slate-700 dark:text-slate-300">Corporate Webmail — Inbox</span>
            </div>
            <span class="text-[11px] text-slate-400 font-mono">Message-ID: #${messageId}</span>
          </div>
          <!-- Header Info -->
          <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-2">
            <h3 class="subject text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">${subject}</h3>
            <div class="flex flex-wrap items-center justify-between gap-2 pt-1 text-slate-600 dark:text-slate-300">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-xs shadow">
                  ${initials}
                </div>
                <div>
                  <span class="sender font-bold text-slate-900 dark:text-white">${senderName}</span>
                  <span class="text-slate-400 text-[11px]">&lt;${senderEmail}&gt;</span>
                </div>
              </div>
              <span class="text-[11px] text-slate-400 font-medium">${timestamp}</span>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400">
              <span class="font-semibold">To:</span> ${recipient}
            </div>
          </div>
          <!-- Email Body -->
          <div class="p-4 sm:p-6 text-slate-800 dark:text-slate-200 leading-relaxed space-y-3 font-normal text-[13px]">
            ${bodyHtml}
          </div>
          ${attachmentHtml}
          <!-- Footer Toolbar -->
          <div class="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs">
            <button class="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 flex items-center gap-1.5">
              <span>↩</span> Reply
            </button>
            <button class="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 flex items-center gap-1.5">
              <span>↪</span> Forward
            </button>
          </div>
        </div>
      `.trim();
    }

    /**
     * Template 2: Official Electronic VAT Invoice (Hóa đơn GTGT điện tử)
     */
    renderInvoice(data = {}) {
      const d = typeof data === 'string' ? { seller: data } : (data || {});
      const serial = this.escapeHtml(d.serial || d.invoiceSerial || 'AA/26E');
      const invoiceNo = this.escapeHtml(d.invoiceNo || d.no || d.number || '0049281');
      const invoiceDate = this.escapeHtml(d.date || d.invoiceDate || '15/10/2026');
      
      const sellerCompany = this.escapeHtml(d.sellerCompany || d.seller || 'Nexus Office Solutions JSC');
      const sellerTaxId = this.escapeHtml(d.sellerTaxId || d.taxId || '0109847291');
      const sellerAddress = this.escapeHtml(d.sellerAddress || 'Floor 8, Diamond Plaza, Le Duan Blvd, Dist 1, HCMC');
      
      const buyerName = this.escapeHtml(d.buyerName || d.buyer || 'Global Trading Ltd');
      const buyerCompany = this.escapeHtml(d.buyerCompany || d.buyerOrg || 'Global Logistics & Supply Chain Corp');
      const paymentMethod = this.escapeHtml(d.paymentMethod || 'Bank Transfer (Chuyển khoản)');

      let items = d.items;
      if (!Array.isArray(items) || items.length === 0) {
        items = [
          { name: 'Ergonomic Executive Desk Chair', unit: 'Pcs', qty: 10, unitPrice: 85.0, amount: 850.0 },
          { name: 'Dual Monitor Aluminum Mount Arm', unit: 'Pcs', qty: 5, unitPrice: 40.0, amount: 200.0 }
        ];
      }

      let subtotalNum = 0;
      const safeItems = (items || []).filter(it => it && typeof it === 'object');
      const rowsHtml = safeItems.map((it, idx) => {
        const itName = this.escapeHtml(it.name || it.description || 'Item ' + (idx + 1));
        const unit = this.escapeHtml(it.unit || 'Pcs');
        const qty = Math.max(1, parseInt(it.quantity || it.qty, 10) || 1);
        const rawPrice = Number(it.unitPrice || it.price);
        const price = (!isNaN(rawPrice) && isFinite(rawPrice)) ? Math.max(0, rawPrice) : 0;
        const rawAmount = Number(it.amount || it.total);
        const amount = (!isNaN(rawAmount) && isFinite(rawAmount)) ? rawAmount : (qty * price);
        subtotalNum += amount;

        const formatCur = (num) => '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
            <td class="p-2.5 text-center font-mono text-slate-400">${idx + 1}</td>
            <td class="p-2.5 font-medium text-slate-800 dark:text-slate-200">${itName}</td>
            <td class="p-2.5 text-center text-slate-500">${unit}</td>
            <td class="p-2.5 text-right font-mono">${qty}</td>
            <td class="p-2.5 text-right font-mono">${formatCur(price)}</td>
            <td class="p-2.5 text-right font-mono font-bold">${formatCur(amount)}</td>
          </tr>
        `;
      }).join('');

      const vatRate = 0.10;
      const vatNum = d.vat !== undefined ? Number(d.vat) : subtotalNum * vatRate;
      const totalNum = d.total !== undefined ? (typeof d.total === 'number' ? d.total : parseFloat(String(d.total).replace(/[^0-9.]/g, '')) || (subtotalNum + vatNum)) : (subtotalNum + vatNum);

      const subtotalFormatted = d.subtotal !== undefined ? (typeof d.subtotal === 'string' ? this.escapeHtml(d.subtotal) : '$' + Number(d.subtotal || 0).toFixed(2)) : '$' + subtotalNum.toFixed(2);
      const vatFormatted = d.vat !== undefined ? (typeof d.vat === 'string' ? this.escapeHtml(d.vat) : '$' + Number(d.vat || 0).toFixed(2)) : '$' + vatNum.toFixed(2);
      const totalFormatted = typeof d.total === 'string' ? this.escapeHtml(d.total) : '$' + totalNum.toFixed(2);

      return `
        <div class="vat-invoice rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-xl font-sans text-xs space-y-4">
          <div class="border-b-2 border-indigo-600 pb-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div class="uppercase tracking-widest text-indigo-600 font-black text-sm">HÓA ĐƠN GIÁ TRỊ GIA TĂNG (VAT INVOICE)</div>
              <div class="text-[11px] text-slate-400 font-mono">Bản thể hiện điện tử theo quy chuẩn ETS Form 01GTKT</div>
            </div>
            <div class="text-right text-[11px] font-mono text-slate-600 dark:text-slate-300">
              <div><strong>Ký hiệu (Serial):</strong> <span>${serial}</span></div>
              <div><strong>Số (No.):</strong> <span class="text-rose-600 font-bold">${invoiceNo}</span></div>
              <div><strong>Ngày (Date):</strong> <span>${invoiceDate}</span></div>
            </div>
          </div>
          <!-- Seller & Buyer Columns -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px] bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <div class="font-black text-indigo-700 dark:text-indigo-400 uppercase text-[11px] mb-1">Đơn vị bán hàng (Seller)</div>
              <div class="font-bold text-slate-900 dark:text-white">${sellerCompany}</div>
              <div class="text-slate-500 text-[11px]">Mã số thuế: ${sellerTaxId}</div>
              <div class="text-slate-500 text-[11px]">Địa chỉ: ${sellerAddress}</div>
            </div>
            <div>
              <div class="font-black text-indigo-700 dark:text-indigo-400 uppercase text-[11px] mb-1">Khách hàng (Buyer)</div>
              <div class="font-bold text-slate-900 dark:text-white">${buyerName}</div>
              <div class="text-slate-500 text-[11px]">Đơn vị: ${buyerCompany}</div>
              <div class="text-slate-500 text-[11px]">Hình thức thanh toán: ${paymentMethod}</div>
            </div>
          </div>
          <!-- Items Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  <th class="p-2.5 w-10 text-center">STT</th>
                  <th class="p-2.5">Tên hàng hóa, dịch vụ (Description)</th>
                  <th class="p-2.5 text-center w-16">ĐVT</th>
                  <th class="p-2.5 text-right w-16">SL</th>
                  <th class="p-2.5 text-right w-24">Đơn giá</th>
                  <th class="p-2.5 text-right w-28">Thành tiền</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                ${rowsHtml}
              </tbody>
            </table>
          </div>
          <!-- Total Summary & Digital Signature -->
          <div class="pt-2 border-t-2 border-slate-200 dark:border-slate-700 flex flex-wrap justify-between items-center gap-3">
            <div class="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-[11px]">
              <span class="text-emerald-600 font-bold text-base">✓</span>
              <span>Đã ký điện tử bởi Chánh Kế toán (Valid Digital Signature)</span>
            </div>
            <div class="text-right text-[12px] space-y-0.5">
              <div>Cộng tiền hàng: <span class="font-semibold">${subtotalFormatted}</span></div>
              <div>Thuế suất GTGT (VAT 10%): <span class="font-semibold">${vatFormatted}</span></div>
              <div class="text-sm font-black text-rose-600">Tổng thanh toán: <span>${totalFormatted}</span></div>
            </div>
          </div>
        </div>
      `.trim();
    }

    /**
     * Template 3: International Airline Boarding Pass
     */
    renderBoardingPass(data = {}) {
      const d = typeof data === 'string' ? { airline: data } : (data || {});
      const airline = this.escapeHtml(d.airline || d.airlineName || 'Pacific Airways');
      const passenger = this.escapeHtml(String(d.passenger || d.passengerName || 'DAVID MILLER').toUpperCase());
      const flight = this.escapeHtml(d.flight || d.flightNo || 'PA-204');
      const gate = this.escapeHtml(d.gate || d.gateNo || 'A12');
      const seat = this.escapeHtml(d.seat || d.seatNo || '14C');
      const origin = this.escapeHtml(d.origin || d.from || 'SGN (Ho Chi Minh)');
      const dest = this.escapeHtml(d.destination || d.to || 'ICN (Seoul Incheon)');
      const boardingTime = this.escapeHtml(d.boardingTime || d.time || '08:20 AM');
      const date = this.escapeHtml(d.date || '24 NOV 2026');

      return `
        <div class="boarding-pass rounded-2xl border-2 border-dashed border-sky-400 bg-gradient-to-r from-sky-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-5 shadow-xl font-sans text-xs space-y-3">
          <div class="flex items-center justify-between pb-3 border-b border-sky-200 dark:border-slate-700">
            <div class="flex items-center gap-2">
              <span class="text-sky-600 text-lg font-black">✈</span>
              <span class="airline font-black text-sm tracking-wider uppercase text-sky-900 dark:text-sky-300">${airline}</span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-sky-600 text-white font-black text-[10px] uppercase tracking-wider">BOARDING PASS</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 text-slate-800 dark:text-slate-200">
            <div>
              <div class="text-[10px] text-slate-400 uppercase font-bold">Passenger</div>
              <div class="text-xs font-black">${passenger}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400 uppercase font-bold">Flight No.</div>
              <div class="flight text-xs font-black text-sky-600 font-mono">${flight}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400 uppercase font-bold">Gate</div>
              <div class="gate text-base font-black text-rose-600 font-mono">${gate}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400 uppercase font-bold">Seat</div>
              <div class="seat text-base font-black text-indigo-600 font-mono">${seat}</div>
            </div>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-sky-200 dark:border-slate-700">
            <div class="space-y-0.5">
              <div class="text-[10px] text-slate-400 font-semibold">FROM / TO • DATE: ${date}</div>
              <div class="font-extrabold text-xs text-slate-900 dark:text-white">${origin} ➔ ${dest}</div>
            </div>
            <div class="space-y-0.5 text-right">
              <div class="text-[10px] text-slate-400 font-semibold">BOARDING TIME</div>
              <div class="font-black text-sm text-sky-700 dark:text-sky-300 font-mono">${boardingTime}</div>
            </div>
          </div>
          <!-- Barcode simulation -->
          <div class="pt-2 flex items-center justify-between">
            <div class="flex items-center gap-1 font-mono tracking-widest text-[9px] text-slate-400">
              ||| | |||| | ||||| || ||| |||| | ||| ||||||| ||| |
            </div>
            <span class="text-[10px] text-slate-400 font-mono">ETKT: 982-204928172</span>
          </div>
        </div>
      `.trim();
    }

    /**
     * Template 4: Enterprise Slack Workspace Notice
     */
    renderSlack(data = {}) {
      const d = typeof data === 'string' ? { message: data } : (data || {});
      const channel = this.escapeHtml(d.channel || '#announcements-internal');
      const members = Number(d.members || 142);
      const posterName = this.escapeHtml(d.posterName || d.sender || 'Elena Rostova');
      const posterBadge = this.escapeHtml(d.posterBadge || 'Operations Lead');
      const postTime = this.escapeHtml(d.postTime || d.timestamp || 'Today at 10:14 AM');
      const rawMsg = d.messageHtml || d.message || d.content || '';
      const messageHtml = this.renderSafeParagraphs(rawMsg, '<p>Hello team, please see latest notice.</p>');
      
      const reactions = Array.isArray(d.reactions) && d.reactions.length > 0
        ? d.reactions.map(r => this.escapeHtml(r))
        : ['👍 18', '👀 24', '🚀 12'];

      const reactionsHtml = reactions.map(r => `
        <span class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] flex items-center gap-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">
          <span>${r}</span>
        </span>
      `).join('');

      const avatarInitials = (posterName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'ER').toUpperCase();

      return `
        <div class="slack-notice rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden font-sans text-xs">
          <div class="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-slate-600 dark:text-slate-300">
            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-bold">#</span>
              <span class="font-bold text-xs text-slate-900 dark:text-white">${channel}</span>
              <span class="text-[11px] text-slate-400">| ${members} members</span>
            </div>
            <span class="text-[11px] text-slate-400">Workspace: Nexus Enterprise</span>
          </div>
          <div class="p-4 sm:p-5 flex items-start gap-3">
            <div class="w-9 h-9 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-sm">
              ${avatarInitials}
            </div>
            <div class="space-y-2 flex-1">
              <div class="flex items-baseline gap-2">
                <span class="font-black text-slate-900 dark:text-white text-xs">${posterName}</span>
                <span class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">${posterBadge}</span>
                <span class="text-[11px] text-slate-400 font-mono">${postTime}</span>
              </div>
              <div class="text-[13px] leading-relaxed text-slate-800 dark:text-slate-200 space-y-2">
                ${messageHtml}
              </div>
              <!-- Reactions -->
              <div class="flex items-center gap-1.5 pt-2">
                ${reactionsHtml}
              </div>
            </div>
          </div>
        </div>
      `.trim();
    }

    /**
     * Fallback for custom or unstructured document types
     */
    renderFallback(docType, content) {
      const typeStr = this.escapeHtml(docType || 'Document');
      const bodyStr = typeof content === 'string'
        ? this.escapeHtml(content).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')
        : (content && content.body ? this.escapeHtml(content.body) : JSON.stringify(content || {}));

      return `
        <div class="generic-document doc-${typeStr.toLowerCase()} rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xl font-sans text-xs space-y-3">
          <div class="pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-slate-500">
            <span class="font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">${typeStr}</span>
            <span class="text-[11px] font-mono text-slate-400">Official Workplace Notice</span>
          </div>
          <div class="text-[13px] leading-relaxed text-slate-800 dark:text-slate-200 space-y-2">
            <p>${bodyStr}</p>
          </div>
        </div>
      `.trim();
    }

    /**
     * Return list of supported authentic templates
     */
    getTemplates() {
      return [
        { id: 'Email', name: 'Corporate Gmail / Webmail', icon: 'fa-envelope', parts: [6, 7] },
        { id: 'Invoice', name: 'Official Electronic VAT Invoice', icon: 'fa-file-invoice-dollar', parts: [7] },
        { id: 'BoardingPass', name: 'International Airline Boarding Pass', icon: 'fa-plane-departure', parts: [7] },
        { id: 'Slack', name: 'Enterprise Slack Notice', icon: 'fa-slack', parts: [6, 7] }
      ];
    }
  }

  return AuthenticDocumentTemplates;
}));
